import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EngineCanvasComponent } from './engine-canvas/engine-canvas.component';
import { StartPageComponent } from './start-page/start-page.component';

const routes: Routes = [
  { path: '', component: StartPageComponent },
  { path: 'lunar-lander', component: EngineCanvasComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
