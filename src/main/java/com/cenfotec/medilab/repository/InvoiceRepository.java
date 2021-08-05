package com.cenfotec.medilab.repository;

import com.cenfotec.medilab.domain.Invoice;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Invoice entity.
 */
@SuppressWarnings("unused")
@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    @Modifying
    @Query(value = "update invoice set status = 'PAID' where id = :id", nativeQuery = true)
    void payInvoice(@Param("id") Long id);
}
