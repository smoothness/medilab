package com.cenfotec.medilab.web.rest;

import com.cenfotec.medilab.domain.RatingUser;
import com.cenfotec.medilab.repository.RatingUserRepository;
import com.cenfotec.medilab.service.RatingUserService;
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
 * REST controller for managing {@link com.cenfotec.medilab.domain.RatingUser}.
 */
@RestController
@RequestMapping("/api")
public class RatingUserResource {

    private final Logger log = LoggerFactory.getLogger(RatingUserResource.class);

    private static final String ENTITY_NAME = "ratingUser";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RatingUserService ratingUserService;

    private final RatingUserRepository ratingUserRepository;

    public RatingUserResource(RatingUserService ratingUserService, RatingUserRepository ratingUserRepository) {
        this.ratingUserService = ratingUserService;
        this.ratingUserRepository = ratingUserRepository;
    }

    /**
     * {@code POST  /rating-users} : Create a new ratingUser.
     *
     * @param ratingUser the ratingUser to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new ratingUser, or with status {@code 400 (Bad Request)} if the ratingUser has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/rating-users")
    public ResponseEntity<RatingUser> createRatingUser(@RequestBody RatingUser ratingUser) throws URISyntaxException {
        log.debug("REST request to save RatingUser : {}", ratingUser);
        if (ratingUser.getId() != null) {
            throw new BadRequestAlertException("A new ratingUser cannot already have an ID", ENTITY_NAME, "idexists");
        }
        RatingUser result = ratingUserService.save(ratingUser);
        return ResponseEntity
            .created(new URI("/api/rating-users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /rating-users/:id} : Updates an existing ratingUser.
     *
     * @param id the id of the ratingUser to save.
     * @param ratingUser the ratingUser to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ratingUser,
     * or with status {@code 400 (Bad Request)} if the ratingUser is not valid,
     * or with status {@code 500 (Internal Server Error)} if the ratingUser couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/rating-users/{id}")
    public ResponseEntity<RatingUser> updateRatingUser(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody RatingUser ratingUser
    ) throws URISyntaxException {
        log.debug("REST request to update RatingUser : {}, {}", id, ratingUser);
        if (ratingUser.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ratingUser.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ratingUserRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        RatingUser result = ratingUserService.save(ratingUser);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ratingUser.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /rating-users/:id} : Partial updates given fields of an existing ratingUser, field will ignore if it is null
     *
     * @param id the id of the ratingUser to save.
     * @param ratingUser the ratingUser to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ratingUser,
     * or with status {@code 400 (Bad Request)} if the ratingUser is not valid,
     * or with status {@code 404 (Not Found)} if the ratingUser is not found,
     * or with status {@code 500 (Internal Server Error)} if the ratingUser couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/rating-users/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<RatingUser> partialUpdateRatingUser(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody RatingUser ratingUser
    ) throws URISyntaxException {
        log.debug("REST request to partial update RatingUser partially : {}, {}", id, ratingUser);
        if (ratingUser.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ratingUser.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ratingUserRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<RatingUser> result = ratingUserService.partialUpdate(ratingUser);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ratingUser.getId().toString())
        );
    }

    /**
     * {@code GET  /rating-users} : get all the ratingUsers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of ratingUsers in body.
     */
    @GetMapping("/rating-users")
    public List<RatingUser> getAllRatingUsers() {
        log.debug("REST request to get all RatingUsers");
        return ratingUserService.findAll();
    }

    /**
     * {@code GET  /rating-users/:id} : get the "id" ratingUser.
     *
     * @param id the id of the ratingUser to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ratingUser, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/rating-users/{id}")
    public ResponseEntity<RatingUser> getRatingUser(@PathVariable Long id) {
        log.debug("REST request to get RatingUser : {}", id);
        Optional<RatingUser> ratingUser = ratingUserService.findOne(id);
        return ResponseUtil.wrapOrNotFound(ratingUser);
    }


    @GetMapping("/rating-users/average/{id}")
    public ResponseEntity<Object> getAverageByDoctor(@PathVariable Long id) {
        Object ratingUser = ratingUserService.findAverageByDoctor(id);
        return ResponseEntity.ok(ratingUser);
    }

    /**
     * {@code DELETE  /rating-users/:id} : delete the "id" ratingUser.
     *
     * @param id the id of the ratingUser to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/rating-users/{id}")
    public ResponseEntity<Void> deleteRatingUser(@PathVariable Long id) {
        log.debug("REST request to delete RatingUser : {}", id);
        ratingUserService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
