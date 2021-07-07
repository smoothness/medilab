package com.cenfotec.medilab.service;

import com.cenfotec.medilab.domain.CommentUser;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link CommentUser}.
 */
public interface CommentUserService {
    /**
     * Save a commentUser.
     *
     * @param commentUser the entity to save.
     * @return the persisted entity.
     */
    CommentUser save(CommentUser commentUser);

    /**
     * Partially updates a commentUser.
     *
     * @param commentUser the entity to update partially.
     * @return the persisted entity.
     */
    Optional<CommentUser> partialUpdate(CommentUser commentUser);

    /**
     * Get all the commentUsers.
     *
     * @return the list of entities.
     */
    List<CommentUser> findAll();

    /**
     * Get the "id" commentUser.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<CommentUser> findOne(Long id);

    /**
     * Delete the "id" commentUser.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
