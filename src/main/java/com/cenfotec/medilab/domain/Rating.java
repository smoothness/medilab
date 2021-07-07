package com.cenfotec.medilab.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Rating.
 */
@Entity
@Table(name = "rating")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Rating implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "value")
    private Integer value;

    @Column(name = "date")
    private LocalDate date;

    @OneToMany(mappedBy = "rating")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "rating", "patient", "doctor" }, allowSetters = true)
    private Set<RatingUser> ratingUsers = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Rating id(Long id) {
        this.id = id;
        return this;
    }

    public Integer getValue() {
        return this.value;
    }

    public Rating value(Integer value) {
        this.value = value;
        return this;
    }

    public void setValue(Integer value) {
        this.value = value;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public Rating date(LocalDate date) {
        this.date = date;
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Set<RatingUser> getRatingUsers() {
        return this.ratingUsers;
    }

    public Rating ratingUsers(Set<RatingUser> ratingUsers) {
        this.setRatingUsers(ratingUsers);
        return this;
    }

    public Rating addRatingUser(RatingUser ratingUser) {
        this.ratingUsers.add(ratingUser);
        ratingUser.setRating(this);
        return this;
    }

    public Rating removeRatingUser(RatingUser ratingUser) {
        this.ratingUsers.remove(ratingUser);
        ratingUser.setRating(null);
        return this;
    }

    public void setRatingUsers(Set<RatingUser> ratingUsers) {
        if (this.ratingUsers != null) {
            this.ratingUsers.forEach(i -> i.setRating(null));
        }
        if (ratingUsers != null) {
            ratingUsers.forEach(i -> i.setRating(this));
        }
        this.ratingUsers = ratingUsers;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Rating)) {
            return false;
        }
        return id != null && id.equals(((Rating) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Rating{" +
            "id=" + getId() +
            ", value=" + getValue() +
            ", date='" + getDate() + "'" +
            "}";
    }
}
