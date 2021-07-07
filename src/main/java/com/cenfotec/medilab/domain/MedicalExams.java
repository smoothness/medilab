package com.cenfotec.medilab.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A MedicalExams.
 */
@Entity
@Table(name = "medical_exams")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class MedicalExams implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "removed")
    private Boolean removed;

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

    public MedicalExams id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public MedicalExams name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public MedicalExams description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getRemoved() {
        return this.removed;
    }

    public MedicalExams removed(Boolean removed) {
        this.removed = removed;
        return this;
    }

    public void setRemoved(Boolean removed) {
        this.removed = removed;
    }

    public Appointment getAppointment() {
        return this.appointment;
    }

    public MedicalExams appointment(Appointment appointment) {
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
        if (!(o instanceof MedicalExams)) {
            return false;
        }
        return id != null && id.equals(((MedicalExams) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "MedicalExams{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", removed='" + getRemoved() + "'" +
            "}";
    }
}
