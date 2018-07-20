import { Injectable, Output, EventEmitter } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from 'firebase';
import { auth } from 'firebase';
import { Observable } from 'rxjs';

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

    /**
     * Event emitted when auth status changes
     */
    @Output() authState = new EventEmitter<boolean>();

    /** *********************************************************************************
     * @param afAuth angularfire2 - https://github.com/angular/angularfire2
     * @param router Used to verify location and navigate the user to new pages as needed
     ***********************************************************************************/
    constructor(public afAuth: AngularFireAuth,
        public router: Router) {
        this.user = afAuth.authState;
        this.authState.emit(false);

        auth().getRedirectResult()
            .catch(console.error);

        this.user.subscribe(user => {
            if (user) {
                auth().updateCurrentUser(user);
                this.userDetails = user;
            } else if (!user) {
                if (this.userDetails) {
                    this.userDetails = null;
                }
                this.doGoogleLogin();
            }
            this.authState.emit(this.canActivate());
            this.router.navigate(['/']);
        });
    }

    /** *********************************************************************************
     * Used to prevent the user from navigating through Katana if they
     * are not logged in with a valid google (byui) account.
     ***********************************************************************************/
    canActivate(): boolean {
        return (this.userDetails !== null && this.userDetails.email.includes('@byui.edu'));
    }

    /** *********************************************************************************
     * Redirects the user to the google login page, where they sign in,
     * and then are returned to Katana to have their credentials processed.
     ***********************************************************************************/
    doGoogleLogin() {
        return new Promise<any>((resolve, reject) => {
            const provider = new auth.GoogleAuthProvider();
            provider.addScope('profile');
            provider.addScope('email');
            auth().setPersistence(auth.Auth.Persistence.SESSION)
                .then(() => {
                    this.afAuth.auth
                        .signInWithRedirect(provider)
                        .catch(function (error) {
                            console.error(error);
                        });
                });
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

    /** *********************************************************************************
     * Retrieves the user's idToken for Firebase, so requests can be validated on the
     * server.
     ***********************************************************************************/
    retrieveToken() {
        return auth().currentUser.getIdToken(true)
            .catch(console.error);
    }
}
