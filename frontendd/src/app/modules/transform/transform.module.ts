import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { TransformComponent } from './components/transform.component';
import { TransformRoutingModule } from './transform-routing.module';

@NgModule({
  declarations: [
    TransformComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    TransformRoutingModule
  ]
})
export class TransformModule {}
