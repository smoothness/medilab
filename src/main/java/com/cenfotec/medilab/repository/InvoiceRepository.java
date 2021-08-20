package com.cenfotec.medilab.repository;

import com.cenfotec.medilab.domain.Invoice;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Invoice entity.
 */
@SuppressWarnings("unused")
@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    int findTopByOrderByIdDesc();

    @Modifying
    @Query(value = "update invoice set status = 'PAID' where id = :id", nativeQuery = true)
    void payInvoice(@Param("id") Long id);

    @Modifying
    @Query(value = "update invoice set status = 'CANCELED' where id = :id", nativeQuery = true)
    void cancelPendingInvoice(@Param("id") Long id);

    @Query(value = "SELECT * FROM invoice where invoice.appointment_id = :id and status <> 'CANCELED'", nativeQuery = true)
    Optional<Invoice> findPendingInvoicesByAppointmentID(@Param("id") Long id);

    @Query(value = "SELECT * FROM invoice where invoice.appointment_id = :id", nativeQuery = true)
    List<Invoice> findInvoicesByAppointmentID(@Param("id") Long id);

    @Query(
        value = "SELECT invoice.id, invoice.appointment_id, invoice.date, invoice.discount, invoice.status, invoice.subtotal, invoice.taxes, invoice.total FROM invoice" +
        " INNER JOIN appointment as app" +
        " ON app.id = invoice.appointment_id" +
        " Inner join patient as pa" +
        " On pa.id = app.patient_id" +
        " WHERE pa.id = :id" +
        " group by invoice.id",
        nativeQuery = true
    )
    List<Invoice> findInvoicesByPatient(@Param("id") Long id);

    @Query(
        value = "SELECT invoice.id, invoice.appointment_id, invoice.date, invoice.discount, invoice.status, invoice.subtotal, invoice.taxes, invoice.total FROM invoice" +
        " INNER JOIN appointment as app" +
        " ON app.id = invoice.appointment_id" +
        " Inner join doctor" +
        " On doctor.id = app.doctor_id" +
        " WHERE doctor.id = :id" +
        " group by invoice.id",
        nativeQuery = true
    )
    List<Invoice> findInvoicesByDoctor(@Param("id") Long id);
}
