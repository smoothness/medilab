package com.cenfotec.medilab.domain;

import com.cenfotec.medilab.domain.enumeration.Status;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Appointment.
 */
@Entity
@Table(name = "appointment")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Appointment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "canceled")
    private Boolean canceled;

    @Column(name = "updated")
    private Boolean updated;

    @Column(name = "notified")
    private Boolean notified;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @OneToMany(mappedBy = "appointment")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "ailment", "treatment", "appointment" }, allowSetters = true)
    private Set<AppointmentTreatmentAilment> appointmentTreatmentAilments = new HashSet<>();

    @OneToMany(mappedBy = "appointment")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "appointment" }, allowSetters = true)
    private Set<MedicalExams> medicalExams = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(
        value = { "internalUser", "emergencyContacts", "ratingUsers", "commentUsers", "internalUsers" },
        allowSetters = true
    )
    private Patient patient;

    @ManyToOne
    @JsonIgnoreProperties(value = { "internalUser", "ratingUsers", "commentUsers", "internalUsers" }, allowSetters = true)
    private Doctor doctor;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Appointment id(Long id) {
        this.id = id;
        return this;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public Appointment date(LocalDate date) {
        this.date = date;
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Boolean getCanceled() {
        return this.canceled;
    }

    public Appointment canceled(Boolean canceled) {
        this.canceled = canceled;
        return this;
    }

    public void setCanceled(Boolean canceled) {
        this.canceled = canceled;
    }

    public Boolean getUpdated() {
        return this.updated;
    }

    public Appointment updated(Boolean updated) {
        this.updated = updated;
        return this;
    }

    public void setUpdated(Boolean updated) {
        this.updated = updated;
    }

    public Boolean getNotified() {
        return this.notified;
    }

    public Appointment notified(Boolean notified) {
        this.notified = notified;
        return this;
    }

    public void setNotified(Boolean notified) {
        this.notified = notified;
    }

    public Status getStatus() {
        return this.status;
    }

    public Appointment status(Status status) {
        this.status = status;
        return this;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Set<AppointmentTreatmentAilment> getAppointmentTreatmentAilments() {
        return this.appointmentTreatmentAilments;
    }

    public Appointment appointmentTreatmentAilments(Set<AppointmentTreatmentAilment> appointmentTreatmentAilments) {
        this.setAppointmentTreatmentAilments(appointmentTreatmentAilments);
        return this;
    }

    public Appointment addAppointmentTreatmentAilment(AppointmentTreatmentAilment appointmentTreatmentAilment) {
        this.appointmentTreatmentAilments.add(appointmentTreatmentAilment);
        appointmentTreatmentAilment.setAppointment(this);
        return this;
    }

    public Appointment removeAppointmentTreatmentAilment(AppointmentTreatmentAilment appointmentTreatmentAilment) {
        this.appointmentTreatmentAilments.remove(appointmentTreatmentAilment);
        appointmentTreatmentAilment.setAppointment(null);
        return this;
    }

    public void setAppointmentTreatmentAilments(Set<AppointmentTreatmentAilment> appointmentTreatmentAilments) {
        if (this.appointmentTreatmentAilments != null) {
            this.appointmentTreatmentAilments.forEach(i -> i.setAppointment(null));
        }
        if (appointmentTreatmentAilments != null) {
            appointmentTreatmentAilments.forEach(i -> i.setAppointment(this));
        }
        this.appointmentTreatmentAilments = appointmentTreatmentAilments;
    }

    public Set<MedicalExams> getMedicalExams() {
        return this.medicalExams;
    }

    public Appointment medicalExams(Set<MedicalExams> medicalExams) {
        this.setMedicalExams(medicalExams);
        return this;
    }

    public Appointment addMedicalExams(MedicalExams medicalExams) {
        this.medicalExams.add(medicalExams);
        medicalExams.setAppointment(this);
        return this;
    }

    public Appointment removeMedicalExams(MedicalExams medicalExams) {
        this.medicalExams.remove(medicalExams);
        medicalExams.setAppointment(null);
        return this;
    }

    public void setMedicalExams(Set<MedicalExams> medicalExams) {
        if (this.medicalExams != null) {
            this.medicalExams.forEach(i -> i.setAppointment(null));
        }
        if (medicalExams != null) {
            medicalExams.forEach(i -> i.setAppointment(this));
        }
        this.medicalExams = medicalExams;
    }

    public Patient getPatient() {
        return this.patient;
    }

    public Appointment patient(Patient patient) {
        this.setPatient(patient);
        return this;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Doctor getDoctor() {
        return this.doctor;
    }

    public Appointment doctor(Doctor doctor) {
        this.setDoctor(doctor);
        return this;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Appointment)) {
            return false;
        }
        return id != null && id.equals(((Appointment) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Appointment{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
