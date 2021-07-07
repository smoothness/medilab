package com.cenfotec.medilab.web.rest;

import com.cenfotec.medilab.domain.CommentUser;
import com.cenfotec.medilab.repository.CommentUserRepository;
import com.cenfotec.medilab.service.CommentUserService;
import com.cenfotec.medilab.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.cenfotec.medilab.domain.CommentUser}.
 */
@RestController
@RequestMapping("/api")
public class CommentUserResource {

    private final Logger log = LoggerFactory.getLogger(CommentUserResource.class);

    private static final String ENTITY_NAME = "commentUser";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CommentUserService commentUserService;

    private final CommentUserRepository commentUserRepository;

    public CommentUserResource(CommentUserService commentUserService, CommentUserRepository commentUserRepository) {
        this.commentUserService = commentUserService;
        this.commentUserRepository = commentUserRepository;
    }

    /**
     * {@code POST  /comment-users} : Create a new commentUser.
     *
     * @param commentUser the commentUser to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new commentUser, or with status {@code 400 (Bad Request)} if the commentUser has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/comment-users")
    public ResponseEntity<CommentUser> createCommentUser(@RequestBody CommentUser commentUser) throws URISyntaxException {
        log.debug("REST request to save CommentUser : {}", commentUser);
        if (commentUser.getId() != null) {
            throw new BadRequestAlertException("A new commentUser cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CommentUser result = commentUserService.save(commentUser);
        return ResponseEntity
            .created(new URI("/api/comment-users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /comment-users/:id} : Updates an existing commentUser.
     *
     * @param id the id of the commentUser to save.
     * @param commentUser the commentUser to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated commentUser,
     * or with status {@code 400 (Bad Request)} if the commentUser is not valid,
     * or with status {@code 500 (Internal Server Error)} if the commentUser couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/comment-users/{id}")
    public ResponseEntity<CommentUser> updateCommentUser(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CommentUser commentUser
    ) throws URISyntaxException {
        log.debug("REST request to update CommentUser : {}, {}", id, commentUser);
        if (commentUser.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, commentUser.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!commentUserRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CommentUser result = commentUserService.save(commentUser);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, commentUser.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /comment-users/:id} : Partial updates given fields of an existing commentUser, field will ignore if it is null
     *
     * @param id the id of the commentUser to save.
     * @param commentUser the commentUser to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated commentUser,
     * or with status {@code 400 (Bad Request)} if the commentUser is not valid,
     * or with status {@code 404 (Not Found)} if the commentUser is not found,
     * or with status {@code 500 (Internal Server Error)} if the commentUser couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/comment-users/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<CommentUser> partialUpdateCommentUser(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CommentUser commentUser
    ) throws URISyntaxException {
        log.debug("REST request to partial update CommentUser partially : {}, {}", id, commentUser);
        if (commentUser.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, commentUser.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!commentUserRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CommentUser> result = commentUserService.partialUpdate(commentUser);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, commentUser.getId().toString())
        );
    }

    /**
     * {@code GET  /comment-users} : get all the commentUsers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of commentUsers in body.
     */
    @GetMapping("/comment-users")
    public List<CommentUser> getAllCommentUsers() {
        log.debug("REST request to get all CommentUsers");
        return commentUserService.findAll();
    }

    /**
     * {@code GET  /comment-users/:id} : get the "id" commentUser.
     *
     * @param id the id of the commentUser to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the commentUser, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/comment-users/{id}")
    public ResponseEntity<CommentUser> getCommentUser(@PathVariable Long id) {
        log.debug("REST request to get CommentUser : {}", id);
        Optional<CommentUser> commentUser = commentUserService.findOne(id);
        return ResponseUtil.wrapOrNotFound(commentUser);
    }

    /**
     * {@code DELETE  /comment-users/:id} : delete the "id" commentUser.
     *
     * @param id the id of the commentUser to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/comment-users/{id}")
    public ResponseEntity<Void> deleteCommentUser(@PathVariable Long id) {
        log.debug("REST request to delete CommentUser : {}", id);
        commentUserService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
