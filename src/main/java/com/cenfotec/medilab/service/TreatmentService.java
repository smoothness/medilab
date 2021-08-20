package com.cenfotec.medilab.service;

import com.cenfotec.medilab.domain.Treatment;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Treatment}.
 */
public interface TreatmentService {
    /**
     * Save a treatment.
     *
     * @param treatment the entity to save.
     * @return the persisted entity.
     */
    Treatment save(Treatment treatment);

    /**
     * Partially updates a treatment.
     *
     * @param treatment the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Treatment> partialUpdate(Treatment treatment);

    /**
     * Get all the treatments.
     *
     * @return the list of entities.
     */
    List<Treatment> findAll();

    /**
     * Get the "id" treatment.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Treatment> findOne(Long id);

    List<Treatment> findAllTreatmentsByAilment(Long ailmentId, Long appointmentId);

    /**
     * Delete the "id" treatment.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
    void updateRemoved(Long id);
}
