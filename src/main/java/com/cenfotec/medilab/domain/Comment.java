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
 * A Comment.
 */
@Entity
@Table(name = "comment")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Comment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "value")
    private Integer value;

    @Column(name = "date")
    private LocalDate date;

    @OneToMany(mappedBy = "comment")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "comment", "patient", "doctor" }, allowSetters = true)
    private Set<CommentUser> commentUsers = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Comment id(Long id) {
        this.id = id;
        return this;
    }

    public Integer getValue() {
        return this.value;
    }

    public Comment value(Integer value) {
        this.value = value;
        return this;
    }

    public void setValue(Integer value) {
        this.value = value;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public Comment date(LocalDate date) {
        this.date = date;
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Set<CommentUser> getCommentUsers() {
        return this.commentUsers;
    }

    public Comment commentUsers(Set<CommentUser> commentUsers) {
        this.setCommentUsers(commentUsers);
        return this;
    }

    public Comment addCommentUser(CommentUser commentUser) {
        this.commentUsers.add(commentUser);
        commentUser.setComment(this);
        return this;
    }

    public Comment removeCommentUser(CommentUser commentUser) {
        this.commentUsers.remove(commentUser);
        commentUser.setComment(null);
        return this;
    }

    public void setCommentUsers(Set<CommentUser> commentUsers) {
        if (this.commentUsers != null) {
            this.commentUsers.forEach(i -> i.setComment(null));
        }
        if (commentUsers != null) {
            commentUsers.forEach(i -> i.setComment(this));
        }
        this.commentUsers = commentUsers;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Comment)) {
            return false;
        }
        return id != null && id.equals(((Comment) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Comment{" +
            "id=" + getId() +
            ", value=" + getValue() +
            ", date='" + getDate() + "'" +
            "}";
    }
}
