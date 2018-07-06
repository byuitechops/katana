import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from 'firebase';
import { auth } from 'firebase';
import { Observable } from 'rxjs';
import { KatanaService } from '../katana.service';

/**
 * Verifies the user is correctly logged in with a valid
 * Google BYUI account. Redirects the user to the Google
 * login page as needed. Provides validation for the user
 * to access various routes.
 */
@Injectable()
export class AuthGuardService implements CanActivate {

    /** *****************************
     *  The currently logged in user
     *******************************/
    private user: Observable<User>;

    /** *****************************
     *  The currently logged in user
     *******************************/
    private userDetails: User = null;

    /** *********************************************************************************
     * @param afAuth angularfire2 - https://github.com/angular/angularfire2
     * @param router Used to verify location and navigate the user to new pages as needed
     ***********************************************************************************/
    constructor(public afAuth: AngularFireAuth,
        public router: Router,
        private katanaService: KatanaService) {
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
            } else {
                this.katanaService.logUserStatus(this.userDetails.email, 'Logged In');
                auth().updateCurrentUser(user);
            }
        });

    }

    /** *********************************************************************************
     * Used to prevent the user from navigating through Katana if they
     * are not logged in with a valid google (byui) account.
     ***********************************************************************************/
    canActivate(): boolean {
        if (this.userDetails !== null && this.userDetails.email.includes('@byui.edu')) {
            return true;
        } else {
            return false;
        }
    }

    /** *********************************************************************************
     * Redirects the user to the google login page, where they sign in,
     * and then are returned to Katana to have their credentials processed.
     ***********************************************************************************/
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

    /** *********************************************************************************
     * Signs the user out of Katana and redirects them to the Google login
     * page.
     ***********************************************************************************/
    signOut() {
        return auth().signOut()
            .then(this.doGoogleLogin)
            .catch(console.error);
    }
}