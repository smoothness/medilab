package com.cenfotec.medilab.service;

import com.cenfotec.medilab.domain.Invoice;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Invoice}.
 */
public interface InvoiceService {
    /**
     * Save a invoice.
     *
     * @param invoice the entity to save.
     * @return the persisted entity.
     */
    Invoice save(Invoice invoice);

    /**
     * Partially updates a invoice.
     *
     * @param invoice the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Invoice> partialUpdate(Invoice invoice);

    /**
     * Get all the invoices.
     *
     * @return the list of entities.
     */
    List<Invoice> findAll();

    /**
     * Get the "id" invoice.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Invoice> findOne(Long id);

    /**
     * Delete the "id" invoice.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
