import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Authority } from 'app/config/authority.constants';

const routes: Routes = [
  {
    path: 'patient',
    data: { authorities: [Authority.ADMIN, Authority.USER] , pageTitle: 'medilabApp.patient.home.title' },
    loadChildren: () => import('./patient/patient.module').then(m => m.PatientModule),
  },
  {
    path: 'doctor',
    data: { authorities: [Authority.ADMIN, Authority.PATIENT] , pageTitle: 'medilabApp.doctor.home.title' },
    loadChildren: () => import('./doctor/doctor.module').then(m => m.DoctorModule),
  },
  {
    path: 'appointment',
    data: { pageTitle: 'medilabApp.appointment.home.title' },
    loadChildren: () => import('./appointment/appointment.module').then(m => m.AppointmentModule),
  },
  {
    path: 'treatment',
    data: { pageTitle: 'medilabApp.treatment.home.title' },
    loadChildren: () => import('./treatment/treatment.module').then(m => m.TreatmentModule),
  },
  {
    path: 'ailment',
    data: { authorities: [Authority.ADMIN] , pageTitle: 'medilabApp.ailment.home.title' },
    loadChildren: () => import('./ailment/ailment.module').then(m => m.AilmentModule),
  },
  {
    path: 'appointment-treatment-ailment',
    data: { pageTitle: 'medilabApp.appointmentTreatmentAilment.home.title' },
    loadChildren: () =>
      import('./appointment-treatment-ailment/appointment-treatment-ailment.module').then(m => m.AppointmentTreatmentAilmentModule),
  },
  {
    path: 'invoice',
    data: { pageTitle: 'medilabApp.invoice.home.title' },
    loadChildren: () => import('./invoice/invoice.module').then(m => m.InvoiceModule),
  },
  {
    path: 'line-comment',
    data: { pageTitle: 'medilabApp.lineComment.home.title' },
    loadChildren: () => import('./line-comment/line-comment.module').then(m => m.LineCommentModule),
  },
  {
    path: 'binnacle',
    data: { pageTitle: 'medilabApp.binnacle.home.title' },
    loadChildren: () => import('./binnacle/binnacle.module').then(m => m.BinnacleModule),
  },
  {
    path: 'rating',
    data: { pageTitle: 'medilabApp.rating.home.title' },
    loadChildren: () => import('./rating/rating.module').then(m => m.RatingModule),
  },
  {
    path: 'rating-user',
    data: { pageTitle: 'medilabApp.ratingUser.home.title' },
    loadChildren: () => import('./rating-user/rating-user.module').then(m => m.RatingUserModule),
  },
  {
    path: 'comment',
    data: { pageTitle: 'medilabApp.comment.home.title' },
    loadChildren: () => import('./comment/comment.module').then(m => m.CommentModule),
  },
  {
    path: 'comment-user',
    data: { pageTitle: 'medilabApp.commentUser.home.title' },
    loadChildren: () => import('./comment-user/comment-user.module').then(m => m.CommentUserModule),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class EntityRoutingModule {}
