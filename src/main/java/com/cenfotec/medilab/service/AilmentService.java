package com.cenfotec.medilab.service;

import com.cenfotec.medilab.domain.Ailment;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Ailment}.
 */
public interface AilmentService {
    /**
     * Save a ailment.
     *
     * @param ailment the entity to save.
     * @return the persisted entity.
     */
    Ailment save(Ailment ailment);

    /**
     * Partially updates a ailment.
     *
     * @param ailment the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Ailment> partialUpdate(Ailment ailment);

    /**
     * Get all the ailments.
     *
     * @return the list of entities.
     */
    List<Ailment> findAll();

    /**
     * Get the "id" ailment.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Ailment> findOne(Long id);

    /**
     * Delete the "id" ailment.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
