package com.cenfotec.medilab.web.rest;

import com.cenfotec.medilab.domain.Ailment;
import com.cenfotec.medilab.repository.AilmentRepository;
import com.cenfotec.medilab.service.AilmentService;
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
 * REST controller for managing {@link com.cenfotec.medilab.domain.Ailment}.
 */
@RestController
@RequestMapping("/api")
public class AilmentResource {

    private final Logger log = LoggerFactory.getLogger(AilmentResource.class);

    private static final String ENTITY_NAME = "ailment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AilmentService ailmentService;

    private final AilmentRepository ailmentRepository;

    public AilmentResource(AilmentService ailmentService, AilmentRepository ailmentRepository) {
        this.ailmentService = ailmentService;
        this.ailmentRepository = ailmentRepository;
    }

    /**
     * {@code POST  /ailments} : Create a new ailment.
     *
     * @param ailment the ailment to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new ailment, or with status {@code 400 (Bad Request)} if the ailment has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/ailments")
    public ResponseEntity<Ailment> createAilment(@RequestBody Ailment ailment) throws URISyntaxException {
        log.debug("REST request to save Ailment : {}", ailment);
        if (ailment.getId() != null) {
            throw new BadRequestAlertException("A new ailment cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Ailment result = ailmentService.save(ailment);
        return ResponseEntity
            .created(new URI("/api/ailments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /ailments/:id} : Updates an existing ailment.
     *
     * @param id the id of the ailment to save.
     * @param ailment the ailment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ailment,
     * or with status {@code 400 (Bad Request)} if the ailment is not valid,
     * or with status {@code 500 (Internal Server Error)} if the ailment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/ailments/{id}")
    public ResponseEntity<Ailment> updateAilment(@PathVariable(value = "id", required = false) final Long id, @RequestBody Ailment ailment)
        throws URISyntaxException {
        log.debug("REST request to update Ailment : {}, {}", id, ailment);
        if (ailment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ailment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ailmentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Ailment result = ailmentService.save(ailment);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ailment.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /ailments/:id} : Partial updates given fields of an existing ailment, field will ignore if it is null
     *
     * @param id the id of the ailment to save.
     * @param ailment the ailment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ailment,
     * or with status {@code 400 (Bad Request)} if the ailment is not valid,
     * or with status {@code 404 (Not Found)} if the ailment is not found,
     * or with status {@code 500 (Internal Server Error)} if the ailment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/ailments/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Ailment> partialUpdateAilment(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Ailment ailment
    ) throws URISyntaxException {
        log.debug("REST request to partial update Ailment partially : {}, {}", id, ailment);
        if (ailment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ailment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ailmentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Ailment> result = ailmentService.partialUpdate(ailment);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ailment.getId().toString())
        );
    }

    /**
     * {@code GET  /ailments} : get all the ailments.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of ailments in body.
     */
    @GetMapping("/ailments")
    public List<Ailment> getAllAilments() {
        log.debug("REST request to get all Ailments");
        return ailmentService.findAll();
    }

    /**
     * {@code GET  /ailments/:id} : get the "id" ailment.
     *
     * @param id the id of the ailment to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ailment, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/ailments/{id}")
    public ResponseEntity<Ailment> getAilment(@PathVariable Long id) {
        log.debug("REST request to get Ailment : {}", id);
        Optional<Ailment> ailment = ailmentService.findOne(id);
        return ResponseUtil.wrapOrNotFound(ailment);
    }

    /**
     * {@code DELETE  /ailments/:id} : delete the "id" ailment.
     *
     * @param id the id of the ailment to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/ailments/{id}")
    public ResponseEntity<Void> deleteAilment(@PathVariable Long id) {
        log.debug("REST request to delete Ailment : {}", id);
        ailmentService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
