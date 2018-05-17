import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoanenquiriesPage } from './loanenquiries';

@NgModule({
  declarations: [
    LoanenquiriesPage,
  ],
  imports: [
    IonicPageModule.forChild(LoanenquiriesPage),
  ],
  exports: [
    LoanenquiriesPage
  ]
})
export class LoanenquiriesPageModule {}
