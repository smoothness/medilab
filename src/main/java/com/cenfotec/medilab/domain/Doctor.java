package com.cenfotec.medilab.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Doctor.
 */
@Entity
@Table(name = "doctor")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Doctor implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "specialty")
    private String specialty;

    @Column(name = "active")
    private Boolean active;

    @OneToOne
    @JoinColumn(unique = true)
    private User internalUser;

    @OneToMany(mappedBy = "doctor")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "rating", "patient", "doctor" }, allowSetters = true)
    private Set<RatingUser> ratingUsers = new HashSet<>();

    @OneToMany(mappedBy = "doctor")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "comment", "patient", "doctor" }, allowSetters = true)
    private Set<CommentUser> commentUsers = new HashSet<>();

    @OneToMany(mappedBy = "doctor")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "appointmentTreatmentAilments", "medicalExams", "patient", "doctor" }, allowSetters = true)
    private Set<Appointment> internalUsers = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Doctor id(Long id) {
        this.id = id;
        return this;
    }

    public String getSpecialty() {
        return this.specialty;
    }

    public Doctor specialty(String specialty) {
        this.specialty = specialty;
        return this;
    }

    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }

    public Boolean getActive() {
        return this.active;
    }

    public Doctor active(Boolean active) {
        this.active = active;
        return this;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public User getInternalUser() {
        return this.internalUser;
    }

    public Doctor internalUser(User user) {
        this.setInternalUser(user);
        return this;
    }

    public void setInternalUser(User user) {
        this.internalUser = user;
    }

    public Set<RatingUser> getRatingUsers() {
        return this.ratingUsers;
    }

    public Doctor ratingUsers(Set<RatingUser> ratingUsers) {
        this.setRatingUsers(ratingUsers);
        return this;
    }

    public Doctor addRatingUser(RatingUser ratingUser) {
        this.ratingUsers.add(ratingUser);
        ratingUser.setDoctor(this);
        return this;
    }

    public Doctor removeRatingUser(RatingUser ratingUser) {
        this.ratingUsers.remove(ratingUser);
        ratingUser.setDoctor(null);
        return this;
    }

    public void setRatingUsers(Set<RatingUser> ratingUsers) {
        if (this.ratingUsers != null) {
            this.ratingUsers.forEach(i -> i.setDoctor(null));
        }
        if (ratingUsers != null) {
            ratingUsers.forEach(i -> i.setDoctor(this));
        }
        this.ratingUsers = ratingUsers;
    }

    public Set<CommentUser> getCommentUsers() {
        return this.commentUsers;
    }

    public Doctor commentUsers(Set<CommentUser> commentUsers) {
        this.setCommentUsers(commentUsers);
        return this;
    }

    public Doctor addCommentUser(CommentUser commentUser) {
        this.commentUsers.add(commentUser);
        commentUser.setDoctor(this);
        return this;
    }

    public Doctor removeCommentUser(CommentUser commentUser) {
        this.commentUsers.remove(commentUser);
        commentUser.setDoctor(null);
        return this;
    }

    public void setCommentUsers(Set<CommentUser> commentUsers) {
        if (this.commentUsers != null) {
            this.commentUsers.forEach(i -> i.setDoctor(null));
        }
        if (commentUsers != null) {
            commentUsers.forEach(i -> i.setDoctor(this));
        }
        this.commentUsers = commentUsers;
    }

    public Set<Appointment> getInternalUsers() {
        return this.internalUsers;
    }

    public Doctor internalUsers(Set<Appointment> appointments) {
        this.setInternalUsers(appointments);
        return this;
    }

    public Doctor addInternalUser(Appointment appointment) {
        this.internalUsers.add(appointment);
        appointment.setDoctor(this);
        return this;
    }

    public Doctor removeInternalUser(Appointment appointment) {
        this.internalUsers.remove(appointment);
        appointment.setDoctor(null);
        return this;
    }

    public void setInternalUsers(Set<Appointment> appointments) {
        if (this.internalUsers != null) {
            this.internalUsers.forEach(i -> i.setDoctor(null));
        }
        if (appointments != null) {
            appointments.forEach(i -> i.setDoctor(this));
        }
        this.internalUsers = appointments;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Doctor)) {
            return false;
        }
        return id != null && id.equals(((Doctor) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Doctor{" +
            "id=" + getId() +
            ", specialty='" + getSpecialty() + "'" +
            ", active='" + getActive() + "'" +
            "}";
    }
}
