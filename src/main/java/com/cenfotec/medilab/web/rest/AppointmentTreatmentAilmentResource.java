package com.cenfotec.medilab.web.rest;

import com.cenfotec.medilab.domain.AppointmentTreatmentAilment;
import com.cenfotec.medilab.repository.AppointmentTreatmentAilmentRepository;
import com.cenfotec.medilab.service.AppointmentTreatmentAilmentService;
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
 * REST controller for managing {@link com.cenfotec.medilab.domain.AppointmentTreatmentAilment}.
 */
@RestController
@RequestMapping("/api")
public class AppointmentTreatmentAilmentResource {

    private final Logger log = LoggerFactory.getLogger(AppointmentTreatmentAilmentResource.class);

    private static final String ENTITY_NAME = "appointmentTreatmentAilment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AppointmentTreatmentAilmentService appointmentTreatmentAilmentService;

    private final AppointmentTreatmentAilmentRepository appointmentTreatmentAilmentRepository;

    public AppointmentTreatmentAilmentResource(
        AppointmentTreatmentAilmentService appointmentTreatmentAilmentService,
        AppointmentTreatmentAilmentRepository appointmentTreatmentAilmentRepository
    ) {
        this.appointmentTreatmentAilmentService = appointmentTreatmentAilmentService;
        this.appointmentTreatmentAilmentRepository = appointmentTreatmentAilmentRepository;
    }

    /**
     * {@code POST  /appointment-treatment-ailments} : Create a new appointmentTreatmentAilment.
     *
     * @param appointmentTreatmentAilment the appointmentTreatmentAilment to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new appointmentTreatmentAilment, or with status {@code 400 (Bad Request)} if the appointmentTreatmentAilment has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/appointment-treatment-ailments")
    public ResponseEntity<AppointmentTreatmentAilment> createAppointmentTreatmentAilment(
        @RequestBody AppointmentTreatmentAilment appointmentTreatmentAilment
    ) throws URISyntaxException {
        log.debug("REST request to save AppointmentTreatmentAilment : {}", appointmentTreatmentAilment);
        if (appointmentTreatmentAilment.getId() != null) {
            throw new BadRequestAlertException("A new appointmentTreatmentAilment cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AppointmentTreatmentAilment result = appointmentTreatmentAilmentService.save(appointmentTreatmentAilment);
        return ResponseEntity
            .created(new URI("/api/appointment-treatment-ailments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /appointment-treatment-ailments/:id} : Updates an existing appointmentTreatmentAilment.
     *
     * @param id the id of the appointmentTreatmentAilment to save.
     * @param appointmentTreatmentAilment the appointmentTreatmentAilment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated appointmentTreatmentAilment,
     * or with status {@code 400 (Bad Request)} if the appointmentTreatmentAilment is not valid,
     * or with status {@code 500 (Internal Server Error)} if the appointmentTreatmentAilment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/appointment-treatment-ailments/{id}")
    public ResponseEntity<AppointmentTreatmentAilment> updateAppointmentTreatmentAilment(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AppointmentTreatmentAilment appointmentTreatmentAilment
    ) throws URISyntaxException {
        log.debug("REST request to update AppointmentTreatmentAilment : {}, {}", id, appointmentTreatmentAilment);
        if (appointmentTreatmentAilment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, appointmentTreatmentAilment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!appointmentTreatmentAilmentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AppointmentTreatmentAilment result = appointmentTreatmentAilmentService.save(appointmentTreatmentAilment);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, appointmentTreatmentAilment.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /appointment-treatment-ailments/:id} : Partial updates given fields of an existing appointmentTreatmentAilment, field will ignore if it is null
     *
     * @param id the id of the appointmentTreatmentAilment to save.
     * @param appointmentTreatmentAilment the appointmentTreatmentAilment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated appointmentTreatmentAilment,
     * or with status {@code 400 (Bad Request)} if the appointmentTreatmentAilment is not valid,
     * or with status {@code 404 (Not Found)} if the appointmentTreatmentAilment is not found,
     * or with status {@code 500 (Internal Server Error)} if the appointmentTreatmentAilment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/appointment-treatment-ailments/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<AppointmentTreatmentAilment> partialUpdateAppointmentTreatmentAilment(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AppointmentTreatmentAilment appointmentTreatmentAilment
    ) throws URISyntaxException {
        log.debug("REST request to partial update AppointmentTreatmentAilment partially : {}, {}", id, appointmentTreatmentAilment);
        if (appointmentTreatmentAilment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, appointmentTreatmentAilment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!appointmentTreatmentAilmentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AppointmentTreatmentAilment> result = appointmentTreatmentAilmentService.partialUpdate(appointmentTreatmentAilment);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, appointmentTreatmentAilment.getId().toString())
        );
    }

    /**
     * {@code GET  /appointment-treatment-ailments} : get all the appointmentTreatmentAilments.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of appointmentTreatmentAilments in body.
     */
    @GetMapping("/appointment-treatment-ailments")
    public List<AppointmentTreatmentAilment> getAllAppointmentTreatmentAilments() {
        log.debug("REST request to get all AppointmentTreatmentAilments");
        return appointmentTreatmentAilmentService.findAll();
    }


    /**
     * {@code GET  /appointment-treatment-ailments/:id} : get the "id" appointmentTreatmentAilment.
     *
     * @param id the id of the appointmentTreatmentAilment to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the appointmentTreatmentAilment, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/appointment-treatment-ailments/{id}")
    public ResponseEntity<AppointmentTreatmentAilment> getAppointmentTreatmentAilment(@PathVariable Long id) {
        log.debug("REST request to get AppointmentTreatmentAilment : {}", id);
        Optional<AppointmentTreatmentAilment> appointmentTreatmentAilment = appointmentTreatmentAilmentService.findOne(id);
        return ResponseUtil.wrapOrNotFound(appointmentTreatmentAilment);
    }

    /**
     * {@code DELETE  /appointment-treatment-ailments/:id} : delete the "id" appointmentTreatmentAilment.
     *
     * @param id the id of the appointmentTreatmentAilment to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/appointment-treatment-ailments/{id}")
    public ResponseEntity<Void> deleteAppointmentTreatmentAilment(@PathVariable Long id) {
        log.debug("REST request to delete AppointmentTreatmentAilment : {}", id);
        appointmentTreatmentAilmentService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
