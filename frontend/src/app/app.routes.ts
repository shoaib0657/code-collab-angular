import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { EditorPageComponent } from './components/pages/editor-page/editor-page.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'editor/:roomId', component: EditorPageComponent },
];
