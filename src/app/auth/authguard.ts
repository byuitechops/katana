import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from 'firebase';
import { auth } from 'firebase';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuardService implements CanActivate {

    private user: Observable<User>;
    private userDetails: User = null;

    constructor(public afAuth: AngularFireAuth, public router: Router) {
        this.user = afAuth.authState;

        auth().getRedirectResult()
            .catch(console.error);

        this.user.subscribe(user => {
            if (user) {
                this.userDetails = user;
            } else {
                this.userDetails = null;
            }
            this.router.navigate(['/']);
        })

        auth().onAuthStateChanged((user) => {
            if (!user || !user.email.includes('@byui.edu')) {
                // LOG USER OUT IF NOT BYUI ACCOUNT
                this.doGoogleLogin();
            } else {
                auth().updateCurrentUser(user);
            }
        });

    }

    canActivate(): boolean {
        if (this.userDetails !== null) {
            return true;
        } else {
            return false;
        }
    }

    doGoogleLogin() {
        return new Promise<any>((resolve, reject) => {
            let provider = new auth.GoogleAuthProvider();
            provider.addScope('profile');
            provider.addScope('email');
            auth().setPersistence(auth.Auth.Persistence.SESSION)
                .then(() => {
                    this.afAuth.auth
                        .signInWithRedirect(provider)
                        .catch(function (error) {
                            console.error(error);
                        });
                })
        });
    }
}