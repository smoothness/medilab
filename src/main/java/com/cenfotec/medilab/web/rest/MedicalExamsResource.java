package com.cenfotec.medilab.web.rest;

import com.cenfotec.medilab.domain.MedicalExams;
import com.cenfotec.medilab.repository.MedicalExamsRepository;
import com.cenfotec.medilab.service.MedicalExamsService;
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
 * REST controller for managing {@link com.cenfotec.medilab.domain.MedicalExams}.
 */
@RestController
@RequestMapping("/api")
public class MedicalExamsResource {

    private final Logger log = LoggerFactory.getLogger(MedicalExamsResource.class);

    private static final String ENTITY_NAME = "medicalExams";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MedicalExamsService medicalExamsService;

    private final MedicalExamsRepository medicalExamsRepository;

    public MedicalExamsResource(MedicalExamsService medicalExamsService, MedicalExamsRepository medicalExamsRepository) {
        this.medicalExamsService = medicalExamsService;
        this.medicalExamsRepository = medicalExamsRepository;
    }

    /**
     * {@code POST  /medical-exams} : Create a new medicalExams.
     *
     * @param medicalExams the medicalExams to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new medicalExams, or with status {@code 400 (Bad Request)} if the medicalExams has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/medical-exams")
    public ResponseEntity<MedicalExams> createMedicalExams(@RequestBody MedicalExams medicalExams) throws URISyntaxException {
        log.debug("REST request to save MedicalExams : {}", medicalExams);
        if (medicalExams.getId() != null) {
            throw new BadRequestAlertException("A new medicalExams cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MedicalExams result = medicalExamsService.save(medicalExams);
        return ResponseEntity
            .created(new URI("/api/medical-exams/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /medical-exams/:id} : Updates an existing medicalExams.
     *
     * @param id the id of the medicalExams to save.
     * @param medicalExams the medicalExams to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated medicalExams,
     * or with status {@code 400 (Bad Request)} if the medicalExams is not valid,
     * or with status {@code 500 (Internal Server Error)} if the medicalExams couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/medical-exams/{id}")
    public ResponseEntity<MedicalExams> updateMedicalExams(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody MedicalExams medicalExams
    ) throws URISyntaxException {
        log.debug("REST request to update MedicalExams : {}, {}", id, medicalExams);
        if (medicalExams.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, medicalExams.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!medicalExamsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        MedicalExams result = medicalExamsService.save(medicalExams);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, medicalExams.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /medical-exams/:id} : Partial updates given fields of an existing medicalExams, field will ignore if it is null
     *
     * @param id the id of the medicalExams to save.
     * @param medicalExams the medicalExams to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated medicalExams,
     * or with status {@code 400 (Bad Request)} if the medicalExams is not valid,
     * or with status {@code 404 (Not Found)} if the medicalExams is not found,
     * or with status {@code 500 (Internal Server Error)} if the medicalExams couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/medical-exams/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<MedicalExams> partialUpdateMedicalExams(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody MedicalExams medicalExams
    ) throws URISyntaxException {
        log.debug("REST request to partial update MedicalExams partially : {}, {}", id, medicalExams);
        if (medicalExams.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, medicalExams.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!medicalExamsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<MedicalExams> result = medicalExamsService.partialUpdate(medicalExams);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, medicalExams.getId().toString())
        );
    }

    /**
     * {@code GET  /medical-exams} : get all the medicalExams.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of medicalExams in body.
     */
    @GetMapping("/medical-exams")
    public List<MedicalExams> getAllMedicalExams() {
        log.debug("REST request to get all MedicalExams");
        return medicalExamsService.findAll();
    }

    @GetMapping("/medical-exams/appointment/{id}")
    public List<MedicalExams> findMedicalExamsByAppointment(@PathVariable Long id) {
        return medicalExamsService.findMedicalExamsByAppointment(id);
    }

    /**
     * {@code GET  /medical-exams/:id} : get the "id" medicalExams.
     *
     * @param id the id of the medicalExams to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the medicalExams, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/medical-exams/{id}")
    public ResponseEntity<MedicalExams> getMedicalExams(@PathVariable Long id) {
        log.debug("REST request to get MedicalExams : {}", id);
        Optional<MedicalExams> medicalExams = medicalExamsService.findOne(id);
        return ResponseUtil.wrapOrNotFound(medicalExams);
    }

    /**
     * {@code DELETE  /medical-exams/:id} : delete the "id" medicalExams.
     *
     * @param id the id of the medicalExams to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/medical-exams/{id}")
    public ResponseEntity<Void> deleteMedicalExams(@PathVariable Long id) {
        log.debug("REST request to delete MedicalExams : {}", id);
        medicalExamsService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @DeleteMapping("/medical-exams-del/{id}")
    public ResponseEntity<Void> deleteByRemoved(@PathVariable Long id) {
        medicalExamsService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
