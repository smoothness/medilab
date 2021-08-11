package com.cenfotec.medilab.domain;

import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import com.cenfotec.medilab.domain.Patient;

/**
 * A Binnacle.
 */
@Entity
@Table(name = "binnacle")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Binnacle implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "doctor_code")
    private String doctorCode;

    @Column(name = "date")
    private LocalDate date;


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

    public Binnacle id(Long id) {
        this.id = id;
        return this;
    }

    public String getDoctorCode() {
        return this.doctorCode;
    }

    public Binnacle doctorCode(String doctorCode) {
        this.doctorCode = doctorCode;
        return this;
    }

    public void setDoctorCode(String doctorCode) {
        this.doctorCode = doctorCode;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public Binnacle date(LocalDate date) {
        this.date = date;
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Patient getPatient() {
        return patient;
    }

    public Binnacle patient(Patient patient) {
        this.patient = patient;
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
        if (!(o instanceof Binnacle)) {
            return false;
        }
        return id != null && id.equals(((Binnacle) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Binnacle{" +
            "id=" + getId() +
            ", doctorCode='" + getDoctorCode() + "'" +
            ", date='" + getDate() + "'" +
            "}";
    }
}
