package com.cenfotec.medilab.domain;

import com.cenfotec.medilab.domain.enumeration.Status;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Invoice.
 */
@Entity
@Table(name = "invoice")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Invoice implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "subtotal")
    private Double subtotal;

    @Column(name = "taxes")
    private Double taxes;

    @Column(name = "discount")
    private Double discount;

    @Column(name = "total")
    private Double total;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @JsonIgnoreProperties(value = { "appointmentTreatmentAilments", "medicalExams", "patient", "doctor" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Appointment appointment;

    @OneToMany(mappedBy = "invoiceCode")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "invoiceCode" }, allowSetters = true)
    private Set<LineComment> lineComments = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Invoice id(Long id) {
        this.id = id;
        return this;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public Invoice date(LocalDate date) {
        this.date = date;
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Double getSubtotal() {
        return this.subtotal;
    }

    public Invoice subtotal(Double subtotal) {
        this.subtotal = subtotal;
        return this;
    }

    public void setSubtotal(Double subtotal) {
        this.subtotal = subtotal;
    }

    public Double getTaxes() {
        return this.taxes;
    }

    public Invoice taxes(Double taxes) {
        this.taxes = taxes;
        return this;
    }

    public void setTaxes(Double taxes) {
        this.taxes = taxes;
    }

    public Double getDiscount() {
        return this.discount;
    }

    public Invoice discount(Double discount) {
        this.discount = discount;
        return this;
    }

    public void setDiscount(Double discount) {
        this.discount = discount;
    }

    public Double getTotal() {
        return this.total;
    }

    public Invoice total(Double total) {
        this.total = total;
        return this;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public Status getStatus() {
        return this.status;
    }

    public Invoice status(Status status) {
        this.status = status;
        return this;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Appointment getAppointment() {
        return this.appointment;
    }

    public Invoice appointment(Appointment appointment) {
        this.setAppointment(appointment);
        return this;
    }

    public void setAppointment(Appointment appointment) {
        this.appointment = appointment;
    }

    public Set<LineComment> getLineComments() {
        return this.lineComments;
    }

    public Invoice lineComments(Set<LineComment> lineComments) {
        this.setLineComments(lineComments);
        return this;
    }

    public Invoice addLineComment(LineComment lineComment) {
        this.lineComments.add(lineComment);
        lineComment.setInvoiceCode(this);
        return this;
    }

    public Invoice removeLineComment(LineComment lineComment) {
        this.lineComments.remove(lineComment);
        lineComment.setInvoiceCode(null);
        return this;
    }

    public void setLineComments(Set<LineComment> lineComments) {
        if (this.lineComments != null) {
            this.lineComments.forEach(i -> i.setInvoiceCode(null));
        }
        if (lineComments != null) {
            lineComments.forEach(i -> i.setInvoiceCode(this));
        }
        this.lineComments = lineComments;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Invoice)) {
            return false;
        }
        return id != null && id.equals(((Invoice) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Invoice{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", subtotal=" + getSubtotal() +
            ", taxes=" + getTaxes() +
            ", discount=" + getDiscount() +
            ", total=" + getTotal() +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
