package com.cenfotec.medilab.service;

import com.cenfotec.medilab.domain.RatingUser;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link RatingUser}.
 */
public interface RatingUserService {
    /**
     * Save a ratingUser.
     *
     * @param ratingUser the entity to save.
     * @return the persisted entity.
     */
    RatingUser save(RatingUser ratingUser);

    /**
     * Partially updates a ratingUser.
     *
     * @param ratingUser the entity to update partially.
     * @return the persisted entity.
     */
    Optional<RatingUser> partialUpdate(RatingUser ratingUser);

    /**
     * Get all the ratingUsers.
     *
     * @return the list of entities.
     */
    List<RatingUser> findAll();

    /**
     * Get the "id" ratingUser.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<RatingUser> findOne(Long id);

    Object findAverageByDoctor(Long id);

    /**
     * Delete the "id" ratingUser.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
