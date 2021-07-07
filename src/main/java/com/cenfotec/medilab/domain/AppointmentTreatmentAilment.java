package com.cenfotec.medilab.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A AppointmentTreatmentAilment.
 */
@Entity
@Table(name = "appointment_treatment_ailment")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class AppointmentTreatmentAilment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "description")
    private String description;

    @Column(name = "removed")
    private Boolean removed;

    @ManyToOne
    @JsonIgnoreProperties(value = { "appointmentTreatmentAilments" }, allowSetters = true)
    private Ailment ailment;

    @ManyToOne
    @JsonIgnoreProperties(value = { "appointmentTreatmentAilments" }, allowSetters = true)
    private Treatment treatment;

    @ManyToOne
    @JsonIgnoreProperties(value = { "appointmentTreatmentAilments", "medicalExams", "patient", "doctor" }, allowSetters = true)
    private Appointment appointment;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AppointmentTreatmentAilment id(Long id) {
        this.id = id;
        return this;
    }

    public String getDescription() {
        return this.description;
    }

    public AppointmentTreatmentAilment description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getRemoved() {
        return this.removed;
    }

    public AppointmentTreatmentAilment removed(Boolean removed) {
        this.removed = removed;
        return this;
    }

    public void setRemoved(Boolean removed) {
        this.removed = removed;
    }

    public Ailment getAilment() {
        return this.ailment;
    }

    public AppointmentTreatmentAilment ailment(Ailment ailment) {
        this.setAilment(ailment);
        return this;
    }

    public void setAilment(Ailment ailment) {
        this.ailment = ailment;
    }

    public Treatment getTreatment() {
        return this.treatment;
    }

    public AppointmentTreatmentAilment treatment(Treatment treatment) {
        this.setTreatment(treatment);
        return this;
    }

    public void setTreatment(Treatment treatment) {
        this.treatment = treatment;
    }

    public Appointment getAppointment() {
        return this.appointment;
    }

    public AppointmentTreatmentAilment appointment(Appointment appointment) {
        this.setAppointment(appointment);
        return this;
    }

    public void setAppointment(Appointment appointment) {
        this.appointment = appointment;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AppointmentTreatmentAilment)) {
            return false;
        }
        return id != null && id.equals(((AppointmentTreatmentAilment) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AppointmentTreatmentAilment{" +
            "id=" + getId() +
            ", description='" + getDescription() + "'" +
            ", removed='" + getRemoved() + "'" +
            "}";
    }
}
