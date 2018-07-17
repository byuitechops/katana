import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import 'materialize-css';
import 'rxjs';

/* Firebase */
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from './firebase.auth';
import { AuthGuardService } from './authguard.service';

/* Modules */
import { SidebarModule } from './sidebar/sidebar.module';
import { HomePageModule } from './home-page/home-page.module';
import { ToolPageModule } from './tool-page/tool-page.module';

/* Katana Components */
import { AppComponent } from './app.component';
import { CategoriesComponent } from './home-page/categories/categories.component';
import { ToolViewComponent } from './tool-page/tool-view/tool-view.component';
import { ToolSelectionComponent } from './home-page/tool-selection/tool-selection.component';
import { OptionsViewComponent } from './home-page/options-view/options-view.component';

export const appRoutes: Routes = [
    {
        path: 'categories',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: 'home',
        component: CategoriesComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'home/tools',
        component: ToolSelectionComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'home/tools/:tool_id/options',
        component: OptionsViewComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'home/tools/:tool_id/issues',
        component: ToolViewComponent,
        canActivate: [AuthGuardService]
    }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        RouterModule.forRoot(
            appRoutes
        ),
        BrowserModule,
        SidebarModule,
        HomePageModule,
        ToolPageModule,
        HttpModule,
        HttpClientModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireAuthModule
    ],
    providers: [
        AuthGuardService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
