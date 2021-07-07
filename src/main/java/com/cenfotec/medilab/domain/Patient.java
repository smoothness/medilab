package com.cenfotec.medilab.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Patient.
 */
@Entity
@Table(name = "patient")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Patient implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "second_surname")
    private String secondSurname;

    @Column(name = "phone")
    private String phone;

    @Column(name = "token")
    private String token;

    @Column(name = "active")
    private Boolean active;

    @OneToOne
    @JoinColumn(unique = true)
    private User internalUser;

    @OneToMany(mappedBy = "patient")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "patient" }, allowSetters = true)
    private Set<EmergencyContact> emergencyContacts = new HashSet<>();

    @OneToMany(mappedBy = "patient")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "rating", "patient", "doctor" }, allowSetters = true)
    private Set<RatingUser> ratingUsers = new HashSet<>();

    @OneToMany(mappedBy = "patient")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "comment", "patient", "doctor" }, allowSetters = true)
    private Set<CommentUser> commentUsers = new HashSet<>();

    @OneToMany(mappedBy = "patient")
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

    public Patient id(Long id) {
        this.id = id;
        return this;
    }

    public String getSecondSurname() {
        return this.secondSurname;
    }

    public Patient secondSurname(String secondSurname) {
        this.secondSurname = secondSurname;
        return this;
    }

    public void setSecondSurname(String secondSurname) {
        this.secondSurname = secondSurname;
    }

    public String getPhone() {
        return this.phone;
    }

    public Patient phone(String phone) {
        this.phone = phone;
        return this;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getToken() {
        return this.token;
    }

    public Patient token(String token) {
        this.token = token;
        return this;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Boolean getActive() {
        return this.active;
    }

    public Patient active(Boolean active) {
        this.active = active;
        return this;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public User getInternalUser() {
        return this.internalUser;
    }

    public Patient internalUser(User user) {
        this.setInternalUser(user);
        return this;
    }

    public void setInternalUser(User user) {
        this.internalUser = user;
    }

    public Set<EmergencyContact> getEmergencyContacts() {
        return this.emergencyContacts;
    }

    public Patient emergencyContacts(Set<EmergencyContact> emergencyContacts) {
        this.setEmergencyContacts(emergencyContacts);
        return this;
    }

    public Patient addEmergencyContact(EmergencyContact emergencyContact) {
        this.emergencyContacts.add(emergencyContact);
        emergencyContact.setPatient(this);
        return this;
    }

    public Patient removeEmergencyContact(EmergencyContact emergencyContact) {
        this.emergencyContacts.remove(emergencyContact);
        emergencyContact.setPatient(null);
        return this;
    }

    public void setEmergencyContacts(Set<EmergencyContact> emergencyContacts) {
        if (this.emergencyContacts != null) {
            this.emergencyContacts.forEach(i -> i.setPatient(null));
        }
        if (emergencyContacts != null) {
            emergencyContacts.forEach(i -> i.setPatient(this));
        }
        this.emergencyContacts = emergencyContacts;
    }

    public Set<RatingUser> getRatingUsers() {
        return this.ratingUsers;
    }

    public Patient ratingUsers(Set<RatingUser> ratingUsers) {
        this.setRatingUsers(ratingUsers);
        return this;
    }

    public Patient addRatingUser(RatingUser ratingUser) {
        this.ratingUsers.add(ratingUser);
        ratingUser.setPatient(this);
        return this;
    }

    public Patient removeRatingUser(RatingUser ratingUser) {
        this.ratingUsers.remove(ratingUser);
        ratingUser.setPatient(null);
        return this;
    }

    public void setRatingUsers(Set<RatingUser> ratingUsers) {
        if (this.ratingUsers != null) {
            this.ratingUsers.forEach(i -> i.setPatient(null));
        }
        if (ratingUsers != null) {
            ratingUsers.forEach(i -> i.setPatient(this));
        }
        this.ratingUsers = ratingUsers;
    }

    public Set<CommentUser> getCommentUsers() {
        return this.commentUsers;
    }

    public Patient commentUsers(Set<CommentUser> commentUsers) {
        this.setCommentUsers(commentUsers);
        return this;
    }

    public Patient addCommentUser(CommentUser commentUser) {
        this.commentUsers.add(commentUser);
        commentUser.setPatient(this);
        return this;
    }

    public Patient removeCommentUser(CommentUser commentUser) {
        this.commentUsers.remove(commentUser);
        commentUser.setPatient(null);
        return this;
    }

    public void setCommentUsers(Set<CommentUser> commentUsers) {
        if (this.commentUsers != null) {
            this.commentUsers.forEach(i -> i.setPatient(null));
        }
        if (commentUsers != null) {
            commentUsers.forEach(i -> i.setPatient(this));
        }
        this.commentUsers = commentUsers;
    }

    public Set<Appointment> getInternalUsers() {
        return this.internalUsers;
    }

    public Patient internalUsers(Set<Appointment> appointments) {
        this.setInternalUsers(appointments);
        return this;
    }

    public Patient addInternalUser(Appointment appointment) {
        this.internalUsers.add(appointment);
        appointment.setPatient(this);
        return this;
    }

    public Patient removeInternalUser(Appointment appointment) {
        this.internalUsers.remove(appointment);
        appointment.setPatient(null);
        return this;
    }

    public void setInternalUsers(Set<Appointment> appointments) {
        if (this.internalUsers != null) {
            this.internalUsers.forEach(i -> i.setPatient(null));
        }
        if (appointments != null) {
            appointments.forEach(i -> i.setPatient(this));
        }
        this.internalUsers = appointments;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Patient)) {
            return false;
        }
        return id != null && id.equals(((Patient) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Patient{" +
            "id=" + getId() +
            ", secondSurname='" + getSecondSurname() + "'" +
            ", phone='" + getPhone() + "'" +
            ", token='" + getToken() + "'" +
            ", active='" + getActive() + "'" +
            "}";
    }
}
