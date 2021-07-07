package com.cenfotec.medilab.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A RatingUser.
 */
@Entity
@Table(name = "rating_user")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class RatingUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonIgnoreProperties(value = { "ratingUsers" }, allowSetters = true)
    private Rating rating;

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

    public RatingUser id(Long id) {
        this.id = id;
        return this;
    }

    public Rating getRating() {
        return this.rating;
    }

    public RatingUser rating(Rating rating) {
        this.setRating(rating);
        return this;
    }

    public void setRating(Rating rating) {
        this.rating = rating;
    }

    public Patient getPatient() {
        return this.patient;
    }

    public RatingUser patient(Patient patient) {
        this.setPatient(patient);
        return this;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Doctor getDoctor() {
        return this.doctor;
    }

    public RatingUser doctor(Doctor doctor) {
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
        if (!(o instanceof RatingUser)) {
            return false;
        }
        return id != null && id.equals(((RatingUser) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "RatingUser{" +
            "id=" + getId() +
            "}";
    }
}
