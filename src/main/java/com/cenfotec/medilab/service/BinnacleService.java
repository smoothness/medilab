package com.cenfotec.medilab.service;

import com.cenfotec.medilab.domain.Binnacle;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Binnacle}.
 */
public interface BinnacleService {
    /**
     * Save a binnacle.
     *
     * @param binnacle the entity to save.
     * @return the persisted entity.
     */
    Binnacle save(Binnacle binnacle);

    /**
     * Partially updates a binnacle.
     *
     * @param binnacle the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Binnacle> partialUpdate(Binnacle binnacle);

    /**
     * Get all the binnacles.
     *
     * @return the list of entities.
     */
    List<Binnacle> findAll();

    /**
     * Get the "id" binnacle.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Binnacle> findOne(Long id);

    /**
     * Delete the "id" binnacle.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
