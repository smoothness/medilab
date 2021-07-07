package com.cenfotec.medilab.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.cenfotec.medilab.IntegrationTest;
import com.cenfotec.medilab.domain.Treatment;
import com.cenfotec.medilab.repository.TreatmentRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link TreatmentResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TreatmentResourceIT {

    private static final String DEFAULT_SPECIFICATIONS = "AAAAAAAAAA";
    private static final String UPDATED_SPECIFICATIONS = "BBBBBBBBBB";

    private static final String DEFAULT_MEDICINES = "AAAAAAAAAA";
    private static final String UPDATED_MEDICINES = "BBBBBBBBBB";

    private static final String DEFAULT_DURATION = "AAAAAAAAAA";
    private static final String UPDATED_DURATION = "BBBBBBBBBB";

    private static final Boolean DEFAULT_REMOVED = false;
    private static final Boolean UPDATED_REMOVED = true;

    private static final String ENTITY_API_URL = "/api/treatments";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TreatmentRepository treatmentRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTreatmentMockMvc;

    private Treatment treatment;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Treatment createEntity(EntityManager em) {
        Treatment treatment = new Treatment()
            .specifications(DEFAULT_SPECIFICATIONS)
            .medicines(DEFAULT_MEDICINES)
            .duration(DEFAULT_DURATION)
            .removed(DEFAULT_REMOVED);
        return treatment;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Treatment createUpdatedEntity(EntityManager em) {
        Treatment treatment = new Treatment()
            .specifications(UPDATED_SPECIFICATIONS)
            .medicines(UPDATED_MEDICINES)
            .duration(UPDATED_DURATION)
            .removed(UPDATED_REMOVED);
        return treatment;
    }

    @BeforeEach
    public void initTest() {
        treatment = createEntity(em);
    }

    @Test
    @Transactional
    void createTreatment() throws Exception {
        int databaseSizeBeforeCreate = treatmentRepository.findAll().size();
        // Create the Treatment
        restTreatmentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(treatment))
            )
            .andExpect(status().isCreated());

        // Validate the Treatment in the database
        List<Treatment> treatmentList = treatmentRepository.findAll();
        assertThat(treatmentList).hasSize(databaseSizeBeforeCreate + 1);
        Treatment testTreatment = treatmentList.get(treatmentList.size() - 1);
        assertThat(testTreatment.getSpecifications()).isEqualTo(DEFAULT_SPECIFICATIONS);
        assertThat(testTreatment.getMedicines()).isEqualTo(DEFAULT_MEDICINES);
        assertThat(testTreatment.getDuration()).isEqualTo(DEFAULT_DURATION);
        assertThat(testTreatment.getRemoved()).isEqualTo(DEFAULT_REMOVED);
    }

    @Test
    @Transactional
    void createTreatmentWithExistingId() throws Exception {
        // Create the Treatment with an existing ID
        treatment.setId(1L);

        int databaseSizeBeforeCreate = treatmentRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTreatmentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(treatment))
            )
            .andExpect(status().isBadRequest());

        // Validate the Treatment in the database
        List<Treatment> treatmentList = treatmentRepository.findAll();
        assertThat(treatmentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTreatments() throws Exception {
        // Initialize the database
        treatmentRepository.saveAndFlush(treatment);

        // Get all the treatmentList
        restTreatmentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(treatment.getId().intValue())))
            .andExpect(jsonPath("$.[*].specifications").value(hasItem(DEFAULT_SPECIFICATIONS)))
            .andExpect(jsonPath("$.[*].medicines").value(hasItem(DEFAULT_MEDICINES)))
            .andExpect(jsonPath("$.[*].duration").value(hasItem(DEFAULT_DURATION)))
            .andExpect(jsonPath("$.[*].removed").value(hasItem(DEFAULT_REMOVED.booleanValue())));
    }

    @Test
    @Transactional
    void getTreatment() throws Exception {
        // Initialize the database
        treatmentRepository.saveAndFlush(treatment);

        // Get the treatment
        restTreatmentMockMvc
            .perform(get(ENTITY_API_URL_ID, treatment.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(treatment.getId().intValue()))
            .andExpect(jsonPath("$.specifications").value(DEFAULT_SPECIFICATIONS))
            .andExpect(jsonPath("$.medicines").value(DEFAULT_MEDICINES))
            .andExpect(jsonPath("$.duration").value(DEFAULT_DURATION))
            .andExpect(jsonPath("$.removed").value(DEFAULT_REMOVED.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingTreatment() throws Exception {
        // Get the treatment
        restTreatmentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTreatment() throws Exception {
        // Initialize the database
        treatmentRepository.saveAndFlush(treatment);

        int databaseSizeBeforeUpdate = treatmentRepository.findAll().size();

        // Update the treatment
        Treatment updatedTreatment = treatmentRepository.findById(treatment.getId()).get();
        // Disconnect from session so that the updates on updatedTreatment are not directly saved in db
        em.detach(updatedTreatment);
        updatedTreatment
            .specifications(UPDATED_SPECIFICATIONS)
            .medicines(UPDATED_MEDICINES)
            .duration(UPDATED_DURATION)
            .removed(UPDATED_REMOVED);

        restTreatmentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTreatment.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTreatment))
            )
            .andExpect(status().isOk());

        // Validate the Treatment in the database
        List<Treatment> treatmentList = treatmentRepository.findAll();
        assertThat(treatmentList).hasSize(databaseSizeBeforeUpdate);
        Treatment testTreatment = treatmentList.get(treatmentList.size() - 1);
        assertThat(testTreatment.getSpecifications()).isEqualTo(UPDATED_SPECIFICATIONS);
        assertThat(testTreatment.getMedicines()).isEqualTo(UPDATED_MEDICINES);
        assertThat(testTreatment.getDuration()).isEqualTo(UPDATED_DURATION);
        assertThat(testTreatment.getRemoved()).isEqualTo(UPDATED_REMOVED);
    }

    @Test
    @Transactional
    void putNonExistingTreatment() throws Exception {
        int databaseSizeBeforeUpdate = treatmentRepository.findAll().size();
        treatment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTreatmentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, treatment.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(treatment))
            )
            .andExpect(status().isBadRequest());

        // Validate the Treatment in the database
        List<Treatment> treatmentList = treatmentRepository.findAll();
        assertThat(treatmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTreatment() throws Exception {
        int databaseSizeBeforeUpdate = treatmentRepository.findAll().size();
        treatment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTreatmentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(treatment))
            )
            .andExpect(status().isBadRequest());

        // Validate the Treatment in the database
        List<Treatment> treatmentList = treatmentRepository.findAll();
        assertThat(treatmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTreatment() throws Exception {
        int databaseSizeBeforeUpdate = treatmentRepository.findAll().size();
        treatment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTreatmentMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(treatment))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Treatment in the database
        List<Treatment> treatmentList = treatmentRepository.findAll();
        assertThat(treatmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTreatmentWithPatch() throws Exception {
        // Initialize the database
        treatmentRepository.saveAndFlush(treatment);

        int databaseSizeBeforeUpdate = treatmentRepository.findAll().size();

        // Update the treatment using partial update
        Treatment partialUpdatedTreatment = new Treatment();
        partialUpdatedTreatment.setId(treatment.getId());

        partialUpdatedTreatment.medicines(UPDATED_MEDICINES);

        restTreatmentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTreatment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTreatment))
            )
            .andExpect(status().isOk());

        // Validate the Treatment in the database
        List<Treatment> treatmentList = treatmentRepository.findAll();
        assertThat(treatmentList).hasSize(databaseSizeBeforeUpdate);
        Treatment testTreatment = treatmentList.get(treatmentList.size() - 1);
        assertThat(testTreatment.getSpecifications()).isEqualTo(DEFAULT_SPECIFICATIONS);
        assertThat(testTreatment.getMedicines()).isEqualTo(UPDATED_MEDICINES);
        assertThat(testTreatment.getDuration()).isEqualTo(DEFAULT_DURATION);
        assertThat(testTreatment.getRemoved()).isEqualTo(DEFAULT_REMOVED);
    }

    @Test
    @Transactional
    void fullUpdateTreatmentWithPatch() throws Exception {
        // Initialize the database
        treatmentRepository.saveAndFlush(treatment);

        int databaseSizeBeforeUpdate = treatmentRepository.findAll().size();

        // Update the treatment using partial update
        Treatment partialUpdatedTreatment = new Treatment();
        partialUpdatedTreatment.setId(treatment.getId());

        partialUpdatedTreatment
            .specifications(UPDATED_SPECIFICATIONS)
            .medicines(UPDATED_MEDICINES)
            .duration(UPDATED_DURATION)
            .removed(UPDATED_REMOVED);

        restTreatmentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTreatment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTreatment))
            )
            .andExpect(status().isOk());

        // Validate the Treatment in the database
        List<Treatment> treatmentList = treatmentRepository.findAll();
        assertThat(treatmentList).hasSize(databaseSizeBeforeUpdate);
        Treatment testTreatment = treatmentList.get(treatmentList.size() - 1);
        assertThat(testTreatment.getSpecifications()).isEqualTo(UPDATED_SPECIFICATIONS);
        assertThat(testTreatment.getMedicines()).isEqualTo(UPDATED_MEDICINES);
        assertThat(testTreatment.getDuration()).isEqualTo(UPDATED_DURATION);
        assertThat(testTreatment.getRemoved()).isEqualTo(UPDATED_REMOVED);
    }

    @Test
    @Transactional
    void patchNonExistingTreatment() throws Exception {
        int databaseSizeBeforeUpdate = treatmentRepository.findAll().size();
        treatment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTreatmentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, treatment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(treatment))
            )
            .andExpect(status().isBadRequest());

        // Validate the Treatment in the database
        List<Treatment> treatmentList = treatmentRepository.findAll();
        assertThat(treatmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTreatment() throws Exception {
        int databaseSizeBeforeUpdate = treatmentRepository.findAll().size();
        treatment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTreatmentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(treatment))
            )
            .andExpect(status().isBadRequest());

        // Validate the Treatment in the database
        List<Treatment> treatmentList = treatmentRepository.findAll();
        assertThat(treatmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTreatment() throws Exception {
        int databaseSizeBeforeUpdate = treatmentRepository.findAll().size();
        treatment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTreatmentMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(treatment))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Treatment in the database
        List<Treatment> treatmentList = treatmentRepository.findAll();
        assertThat(treatmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTreatment() throws Exception {
        // Initialize the database
        treatmentRepository.saveAndFlush(treatment);

        int databaseSizeBeforeDelete = treatmentRepository.findAll().size();

        // Delete the treatment
        restTreatmentMockMvc
            .perform(delete(ENTITY_API_URL_ID, treatment.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Treatment> treatmentList = treatmentRepository.findAll();
        assertThat(treatmentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
