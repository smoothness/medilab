package com.cenfotec.medilab.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Ailment.
 */
@Entity
@Table(name = "ailment")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Ailment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "removed")
    private Boolean removed;

    @Transient
    private Integer total;

    @OneToMany(mappedBy = "ailment")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "ailment", "treatment", "appointment" }, allowSetters = true)
    private Set<AppointmentTreatmentAilment> appointmentTreatmentAilments = new HashSet<>();

    public Ailment() {}

    public Ailment(Long id, String name, Boolean removed) {
        this.id = id;
        this.name = name;
        this.removed = removed;
    }

    public Ailment(Long id, String name, Boolean removed, Integer total) {
        this.id = id;
        this.name = name;
        this.removed = removed;
        this.total = total;
    }

    public Ailment(Long id, String name, Integer total) {
        this.id = id;
        this.name = name;
        this.total = total;
    }

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public void setTotal(Integer total) {
        this.total = total;
    }

    public Integer getTotal() {
        return total;
    }

    public Ailment total(Integer total) {
        this.total = total;
        return this;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Ailment id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Ailment name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getRemoved() {
        return this.removed;
    }

    public Ailment removed(Boolean removed) {
        this.removed = removed;
        return this;
    }

    public void setRemoved(Boolean removed) {
        this.removed = removed;
    }

    public Set<AppointmentTreatmentAilment> getAppointmentTreatmentAilments() {
        return this.appointmentTreatmentAilments;
    }

    public Ailment appointmentTreatmentAilments(Set<AppointmentTreatmentAilment> appointmentTreatmentAilments) {
        this.setAppointmentTreatmentAilments(appointmentTreatmentAilments);
        return this;
    }

    public Ailment addAppointmentTreatmentAilment(AppointmentTreatmentAilment appointmentTreatmentAilment) {
        this.appointmentTreatmentAilments.add(appointmentTreatmentAilment);
        appointmentTreatmentAilment.setAilment(this);
        return this;
    }

    public Ailment removeAppointmentTreatmentAilment(AppointmentTreatmentAilment appointmentTreatmentAilment) {
        this.appointmentTreatmentAilments.remove(appointmentTreatmentAilment);
        appointmentTreatmentAilment.setAilment(null);
        return this;
    }

    public void setAppointmentTreatmentAilments(Set<AppointmentTreatmentAilment> appointmentTreatmentAilments) {
        if (this.appointmentTreatmentAilments != null) {
            this.appointmentTreatmentAilments.forEach(i -> i.setAilment(null));
        }
        if (appointmentTreatmentAilments != null) {
            appointmentTreatmentAilments.forEach(i -> i.setAilment(this));
        }
        this.appointmentTreatmentAilments = appointmentTreatmentAilments;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Ailment)) {
            return false;
        }
        return id != null && id.equals(((Ailment) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Ailment{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", removed='" + getRemoved() + "'" +
            "}";
    }
}
