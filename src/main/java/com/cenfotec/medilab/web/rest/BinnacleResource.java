package com.cenfotec.medilab.web.rest;

import com.cenfotec.medilab.domain.Binnacle;
import com.cenfotec.medilab.repository.BinnacleRepository;
import com.cenfotec.medilab.service.BinnacleService;
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
 * REST controller for managing {@link com.cenfotec.medilab.domain.Binnacle}.
 */
@RestController
@RequestMapping("/api")
public class BinnacleResource {

    private final Logger log = LoggerFactory.getLogger(BinnacleResource.class);

    private static final String ENTITY_NAME = "binnacle";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BinnacleService binnacleService;

    private final BinnacleRepository binnacleRepository;

    public BinnacleResource(BinnacleService binnacleService, BinnacleRepository binnacleRepository) {
        this.binnacleService = binnacleService;
        this.binnacleRepository = binnacleRepository;
    }

    /**
     * {@code POST  /binnacles} : Create a new binnacle.
     *
     * @param binnacle the binnacle to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new binnacle, or with status {@code 400 (Bad Request)} if the binnacle has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/binnacles")
    public ResponseEntity<Binnacle> createBinnacle(@RequestBody Binnacle binnacle) throws URISyntaxException {
        log.debug("REST request to save Binnacle : {}", binnacle);
        if (binnacle.getId() != null) {
            throw new BadRequestAlertException("A new binnacle cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Binnacle result = binnacleService.save(binnacle);
        return ResponseEntity
            .created(new URI("/api/binnacles/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /binnacles/:id} : Updates an existing binnacle.
     *
     * @param id the id of the binnacle to save.
     * @param binnacle the binnacle to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated binnacle,
     * or with status {@code 400 (Bad Request)} if the binnacle is not valid,
     * or with status {@code 500 (Internal Server Error)} if the binnacle couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/binnacles/{id}")
    public ResponseEntity<Binnacle> updateBinnacle(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Binnacle binnacle
    ) throws URISyntaxException {
        log.debug("REST request to update Binnacle : {}, {}", id, binnacle);
        if (binnacle.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, binnacle.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!binnacleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Binnacle result = binnacleService.save(binnacle);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, binnacle.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /binnacles/:id} : Partial updates given fields of an existing binnacle, field will ignore if it is null
     *
     * @param id the id of the binnacle to save.
     * @param binnacle the binnacle to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated binnacle,
     * or with status {@code 400 (Bad Request)} if the binnacle is not valid,
     * or with status {@code 404 (Not Found)} if the binnacle is not found,
     * or with status {@code 500 (Internal Server Error)} if the binnacle couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/binnacles/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Binnacle> partialUpdateBinnacle(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Binnacle binnacle
    ) throws URISyntaxException {
        log.debug("REST request to partial update Binnacle partially : {}, {}", id, binnacle);
        if (binnacle.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, binnacle.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!binnacleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Binnacle> result = binnacleService.partialUpdate(binnacle);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, binnacle.getId().toString())
        );
    }

    /**
     * {@code GET  /binnacles} : get all the binnacles.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of binnacles in body.
     */
    @GetMapping("/binnacles")
    public List<Binnacle> getAllBinnacles() {
        log.debug("REST request to get all Binnacles");
        return binnacleService.findAll();
    }

    /**
     * {@code GET  /binnacles/:id} : get the "id" binnacle.
     *
     * @param id the id of the binnacle to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the binnacle, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/binnacles/{id}")
    public ResponseEntity<Binnacle> getBinnacle(@PathVariable Long id) {
        log.debug("REST request to get Binnacle : {}", id);
        Optional<Binnacle> binnacle = binnacleService.findOne(id);
        return ResponseUtil.wrapOrNotFound(binnacle);
    }

    /**
     * {@code DELETE  /binnacles/:id} : delete the "id" binnacle.
     *
     * @param id the id of the binnacle to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/binnacles/{id}")
    public ResponseEntity<Void> deleteBinnacle(@PathVariable Long id) {
        log.debug("REST request to delete Binnacle : {}", id);
        binnacleService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
