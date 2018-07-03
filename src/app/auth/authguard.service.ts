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
            // If there isn't a user signed in, redirect to login
            if (!user) {
                this.doGoogleLogin();

                // If there is a user signed in, but it isn't a BYUI address, same thing
            } else if (!user.email.includes('@byui.edu')) {
                window.alert('You must use a BYU-I google account!');
                this.signOut()
                    .then(this.doGoogleLogin)

                // Set the current user to who is signed in
            } else {
                auth().updateCurrentUser(user);
            }
        });

    }

    canActivate(): boolean {
        if (this.userDetails !== null && this.userDetails.email.includes('@byui.edu')) {
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

    signOut() {
        return auth().signOut()
            .then(this.doGoogleLogin)
            .catch(console.error);
    }
}