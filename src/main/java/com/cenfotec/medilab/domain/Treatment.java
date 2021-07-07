package com.cenfotec.medilab.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Treatment.
 */
@Entity
@Table(name = "treatment")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Treatment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "specifications")
    private String specifications;

    @Column(name = "medicines")
    private String medicines;

    @Column(name = "duration")
    private String duration;

    @Column(name = "removed")
    private Boolean removed;

    @OneToMany(mappedBy = "treatment")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "ailment", "treatment", "appointment" }, allowSetters = true)
    private Set<AppointmentTreatmentAilment> appointmentTreatmentAilments = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Treatment id(Long id) {
        this.id = id;
        return this;
    }

    public String getSpecifications() {
        return this.specifications;
    }

    public Treatment specifications(String specifications) {
        this.specifications = specifications;
        return this;
    }

    public void setSpecifications(String specifications) {
        this.specifications = specifications;
    }

    public String getMedicines() {
        return this.medicines;
    }

    public Treatment medicines(String medicines) {
        this.medicines = medicines;
        return this;
    }

    public void setMedicines(String medicines) {
        this.medicines = medicines;
    }

    public String getDuration() {
        return this.duration;
    }

    public Treatment duration(String duration) {
        this.duration = duration;
        return this;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public Boolean getRemoved() {
        return this.removed;
    }

    public Treatment removed(Boolean removed) {
        this.removed = removed;
        return this;
    }

    public void setRemoved(Boolean removed) {
        this.removed = removed;
    }

    public Set<AppointmentTreatmentAilment> getAppointmentTreatmentAilments() {
        return this.appointmentTreatmentAilments;
    }

    public Treatment appointmentTreatmentAilments(Set<AppointmentTreatmentAilment> appointmentTreatmentAilments) {
        this.setAppointmentTreatmentAilments(appointmentTreatmentAilments);
        return this;
    }

    public Treatment addAppointmentTreatmentAilment(AppointmentTreatmentAilment appointmentTreatmentAilment) {
        this.appointmentTreatmentAilments.add(appointmentTreatmentAilment);
        appointmentTreatmentAilment.setTreatment(this);
        return this;
    }

    public Treatment removeAppointmentTreatmentAilment(AppointmentTreatmentAilment appointmentTreatmentAilment) {
        this.appointmentTreatmentAilments.remove(appointmentTreatmentAilment);
        appointmentTreatmentAilment.setTreatment(null);
        return this;
    }

    public void setAppointmentTreatmentAilments(Set<AppointmentTreatmentAilment> appointmentTreatmentAilments) {
        if (this.appointmentTreatmentAilments != null) {
            this.appointmentTreatmentAilments.forEach(i -> i.setTreatment(null));
        }
        if (appointmentTreatmentAilments != null) {
            appointmentTreatmentAilments.forEach(i -> i.setTreatment(this));
        }
        this.appointmentTreatmentAilments = appointmentTreatmentAilments;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Treatment)) {
            return false;
        }
        return id != null && id.equals(((Treatment) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Treatment{" +
            "id=" + getId() +
            ", specifications='" + getSpecifications() + "'" +
            ", medicines='" + getMedicines() + "'" +
            ", duration='" + getDuration() + "'" +
            ", removed='" + getRemoved() + "'" +
            "}";
    }
}
