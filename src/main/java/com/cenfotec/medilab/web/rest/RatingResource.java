package com.cenfotec.medilab.web.rest;

import com.cenfotec.medilab.domain.Rating;
import com.cenfotec.medilab.repository.RatingRepository;
import com.cenfotec.medilab.service.RatingService;
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
 * REST controller for managing {@link com.cenfotec.medilab.domain.Rating}.
 */
@RestController
@RequestMapping("/api")
public class RatingResource {

    private final Logger log = LoggerFactory.getLogger(RatingResource.class);

    private static final String ENTITY_NAME = "rating";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RatingService ratingService;

    private final RatingRepository ratingRepository;

    public RatingResource(RatingService ratingService, RatingRepository ratingRepository) {
        this.ratingService = ratingService;
        this.ratingRepository = ratingRepository;
    }

    /**
     * {@code POST  /ratings} : Create a new rating.
     *
     * @param rating the rating to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new rating, or with status {@code 400 (Bad Request)} if the rating has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/ratings")
    public ResponseEntity<Rating> createRating(@RequestBody Rating rating) throws URISyntaxException {
        log.debug("REST request to save Rating : {}", rating);
        if (rating.getId() != null) {
            throw new BadRequestAlertException("A new rating cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Rating result = ratingService.save(rating);
        return ResponseEntity
            .created(new URI("/api/ratings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /ratings/:id} : Updates an existing rating.
     *
     * @param id the id of the rating to save.
     * @param rating the rating to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated rating,
     * or with status {@code 400 (Bad Request)} if the rating is not valid,
     * or with status {@code 500 (Internal Server Error)} if the rating couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/ratings/{id}")
    public ResponseEntity<Rating> updateRating(@PathVariable(value = "id", required = false) final Long id, @RequestBody Rating rating)
        throws URISyntaxException {
        log.debug("REST request to update Rating : {}, {}", id, rating);
        if (rating.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, rating.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ratingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Rating result = ratingService.save(rating);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, rating.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /ratings/:id} : Partial updates given fields of an existing rating, field will ignore if it is null
     *
     * @param id the id of the rating to save.
     * @param rating the rating to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated rating,
     * or with status {@code 400 (Bad Request)} if the rating is not valid,
     * or with status {@code 404 (Not Found)} if the rating is not found,
     * or with status {@code 500 (Internal Server Error)} if the rating couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/ratings/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Rating> partialUpdateRating(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Rating rating
    ) throws URISyntaxException {
        log.debug("REST request to partial update Rating partially : {}, {}", id, rating);
        if (rating.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, rating.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ratingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Rating> result = ratingService.partialUpdate(rating);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, rating.getId().toString())
        );
    }

    /**
     * {@code GET  /ratings} : get all the ratings.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of ratings in body.
     */
    @GetMapping("/ratings")
    public List<Rating> getAllRatings() {
        log.debug("REST request to get all Ratings");
        return ratingService.findAll();
    }

    /**
     * {@code GET  /ratings/:id} : get the "id" rating.
     *
     * @param id the id of the rating to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the rating, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/ratings/{id}")
    public ResponseEntity<Rating> getRating(@PathVariable Long id) {
        log.debug("REST request to get Rating : {}", id);
        Optional<Rating> rating = ratingService.findOne(id);
        return ResponseUtil.wrapOrNotFound(rating);
    }

    /**
     * {@code DELETE  /ratings/:id} : delete the "id" rating.
     *
     * @param id the id of the rating to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/ratings/{id}")
    public ResponseEntity<Void> deleteRating(@PathVariable Long id) {
        log.debug("REST request to delete Rating : {}", id);
        ratingService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
