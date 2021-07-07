package com.cenfotec.medilab.service;

import com.cenfotec.medilab.domain.Rating;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Rating}.
 */
public interface RatingService {
    /**
     * Save a rating.
     *
     * @param rating the entity to save.
     * @return the persisted entity.
     */
    Rating save(Rating rating);

    /**
     * Partially updates a rating.
     *
     * @param rating the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Rating> partialUpdate(Rating rating);

    /**
     * Get all the ratings.
     *
     * @return the list of entities.
     */
    List<Rating> findAll();

    /**
     * Get the "id" rating.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Rating> findOne(Long id);

    /**
     * Delete the "id" rating.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
