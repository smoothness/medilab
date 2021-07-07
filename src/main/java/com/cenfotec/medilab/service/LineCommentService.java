package com.cenfotec.medilab.service;

import com.cenfotec.medilab.domain.LineComment;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link LineComment}.
 */
public interface LineCommentService {
    /**
     * Save a lineComment.
     *
     * @param lineComment the entity to save.
     * @return the persisted entity.
     */
    LineComment save(LineComment lineComment);

    /**
     * Partially updates a lineComment.
     *
     * @param lineComment the entity to update partially.
     * @return the persisted entity.
     */
    Optional<LineComment> partialUpdate(LineComment lineComment);

    /**
     * Get all the lineComments.
     *
     * @return the list of entities.
     */
    List<LineComment> findAll();

    /**
     * Get the "id" lineComment.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<LineComment> findOne(Long id);

    /**
     * Delete the "id" lineComment.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
