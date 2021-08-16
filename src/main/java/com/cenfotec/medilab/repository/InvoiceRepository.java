package com.cenfotec.medilab.repository;

import com.cenfotec.medilab.domain.Invoice;
import java.util.List;
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

    @Query(value = "select * from invoice where appointment_id = :id and status = 'PENDING'", nativeQuery = true)
    List<Invoice> findPendingInvoicesByAppointmentID(@Param("id") Long id);
}
