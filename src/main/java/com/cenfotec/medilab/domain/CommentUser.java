package com.cenfotec.medilab.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A CommentUser.
 */
@Entity
@Table(name = "comment_user")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class CommentUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonIgnoreProperties(value = { "commentUsers" }, allowSetters = true)
    private Comment comment;

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

    public CommentUser id(Long id) {
        this.id = id;
        return this;
    }

    public Comment getComment() {
        return this.comment;
    }

    public CommentUser comment(Comment comment) {
        this.setComment(comment);
        return this;
    }

    public void setComment(Comment comment) {
        this.comment = comment;
    }

    public Patient getPatient() {
        return this.patient;
    }

    public CommentUser patient(Patient patient) {
        this.setPatient(patient);
        return this;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Doctor getDoctor() {
        return this.doctor;
    }

    public CommentUser doctor(Doctor doctor) {
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
        if (!(o instanceof CommentUser)) {
            return false;
        }
        return id != null && id.equals(((CommentUser) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CommentUser{" +
            "id=" + getId() +
            "}";
    }
}
