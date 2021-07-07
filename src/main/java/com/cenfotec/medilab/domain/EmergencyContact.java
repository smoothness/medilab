package com.cenfotec.medilab.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A EmergencyContact.
 */
@Entity
@Table(name = "emergency_contact")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class EmergencyContact implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "phone")
    private String phone;

    @Column(name = "email")
    private String email;

    @Column(name = "relation_ship")
    private String relationShip;

    @ManyToOne
    @JsonIgnoreProperties(
        value = { "internalUser", "emergencyContacts", "ratingUsers", "commentUsers", "internalUsers" },
        allowSetters = true
    )
    private Patient patient;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public EmergencyContact id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public EmergencyContact name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return this.phone;
    }

    public EmergencyContact phone(String phone) {
        this.phone = phone;
        return this;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return this.email;
    }

    public EmergencyContact email(String email) {
        this.email = email;
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRelationShip() {
        return this.relationShip;
    }

    public EmergencyContact relationShip(String relationShip) {
        this.relationShip = relationShip;
        return this;
    }

    public void setRelationShip(String relationShip) {
        this.relationShip = relationShip;
    }

    public Patient getPatient() {
        return this.patient;
    }

    public EmergencyContact patient(Patient patient) {
        this.setPatient(patient);
        return this;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EmergencyContact)) {
            return false;
        }
        return id != null && id.equals(((EmergencyContact) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EmergencyContact{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", phone='" + getPhone() + "'" +
            ", email='" + getEmail() + "'" +
            ", relationShip='" + getRelationShip() + "'" +
            "}";
    }
}
