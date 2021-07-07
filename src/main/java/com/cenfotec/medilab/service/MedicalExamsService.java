package com.cenfotec.medilab.service;

import com.cenfotec.medilab.domain.MedicalExams;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link MedicalExams}.
 */
public interface MedicalExamsService {
    /**
     * Save a medicalExams.
     *
     * @param medicalExams the entity to save.
     * @return the persisted entity.
     */
    MedicalExams save(MedicalExams medicalExams);

    /**
     * Partially updates a medicalExams.
     *
     * @param medicalExams the entity to update partially.
     * @return the persisted entity.
     */
    Optional<MedicalExams> partialUpdate(MedicalExams medicalExams);

    /**
     * Get all the medicalExams.
     *
     * @return the list of entities.
     */
    List<MedicalExams> findAll();

    /**
     * Get the "id" medicalExams.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<MedicalExams> findOne(Long id);

    /**
     * Delete the "id" medicalExams.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
