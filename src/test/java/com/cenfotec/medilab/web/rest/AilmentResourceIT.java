package com.cenfotec.medilab.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.cenfotec.medilab.IntegrationTest;
import com.cenfotec.medilab.domain.Ailment;
import com.cenfotec.medilab.repository.AilmentRepository;
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
 * Integration tests for the {@link AilmentResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AilmentResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Boolean DEFAULT_REMOVED = false;
    private static final Boolean UPDATED_REMOVED = true;

    private static final String ENTITY_API_URL = "/api/ailments";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AilmentRepository ailmentRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAilmentMockMvc;

    private Ailment ailment;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Ailment createEntity(EntityManager em) {
        Ailment ailment = new Ailment().name(DEFAULT_NAME).removed(DEFAULT_REMOVED);
        return ailment;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Ailment createUpdatedEntity(EntityManager em) {
        Ailment ailment = new Ailment().name(UPDATED_NAME).removed(UPDATED_REMOVED);
        return ailment;
    }

    @BeforeEach
    public void initTest() {
        ailment = createEntity(em);
    }

    @Test
    @Transactional
    void createAilment() throws Exception {
        int databaseSizeBeforeCreate = ailmentRepository.findAll().size();
        // Create the Ailment
        restAilmentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ailment))
            )
            .andExpect(status().isCreated());

        // Validate the Ailment in the database
        List<Ailment> ailmentList = ailmentRepository.findAll();
        assertThat(ailmentList).hasSize(databaseSizeBeforeCreate + 1);
        Ailment testAilment = ailmentList.get(ailmentList.size() - 1);
        assertThat(testAilment.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAilment.getRemoved()).isEqualTo(DEFAULT_REMOVED);
    }

    @Test
    @Transactional
    void createAilmentWithExistingId() throws Exception {
        // Create the Ailment with an existing ID
        ailment.setId(1L);

        int databaseSizeBeforeCreate = ailmentRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAilmentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ailment))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ailment in the database
        List<Ailment> ailmentList = ailmentRepository.findAll();
        assertThat(ailmentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAilments() throws Exception {
        // Initialize the database
        ailmentRepository.saveAndFlush(ailment);

        // Get all the ailmentList
        restAilmentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ailment.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].removed").value(hasItem(DEFAULT_REMOVED.booleanValue())));
    }

    @Test
    @Transactional
    void getAilment() throws Exception {
        // Initialize the database
        ailmentRepository.saveAndFlush(ailment);

        // Get the ailment
        restAilmentMockMvc
            .perform(get(ENTITY_API_URL_ID, ailment.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(ailment.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.removed").value(DEFAULT_REMOVED.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingAilment() throws Exception {
        // Get the ailment
        restAilmentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAilment() throws Exception {
        // Initialize the database
        ailmentRepository.saveAndFlush(ailment);

        int databaseSizeBeforeUpdate = ailmentRepository.findAll().size();

        // Update the ailment
        Ailment updatedAilment = ailmentRepository.findById(ailment.getId()).get();
        // Disconnect from session so that the updates on updatedAilment are not directly saved in db
        em.detach(updatedAilment);
        updatedAilment.name(UPDATED_NAME).removed(UPDATED_REMOVED);

        restAilmentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAilment.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAilment))
            )
            .andExpect(status().isOk());

        // Validate the Ailment in the database
        List<Ailment> ailmentList = ailmentRepository.findAll();
        assertThat(ailmentList).hasSize(databaseSizeBeforeUpdate);
        Ailment testAilment = ailmentList.get(ailmentList.size() - 1);
        assertThat(testAilment.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAilment.getRemoved()).isEqualTo(UPDATED_REMOVED);
    }

    @Test
    @Transactional
    void putNonExistingAilment() throws Exception {
        int databaseSizeBeforeUpdate = ailmentRepository.findAll().size();
        ailment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAilmentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, ailment.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ailment))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ailment in the database
        List<Ailment> ailmentList = ailmentRepository.findAll();
        assertThat(ailmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAilment() throws Exception {
        int databaseSizeBeforeUpdate = ailmentRepository.findAll().size();
        ailment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAilmentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ailment))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ailment in the database
        List<Ailment> ailmentList = ailmentRepository.findAll();
        assertThat(ailmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAilment() throws Exception {
        int databaseSizeBeforeUpdate = ailmentRepository.findAll().size();
        ailment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAilmentMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ailment))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Ailment in the database
        List<Ailment> ailmentList = ailmentRepository.findAll();
        assertThat(ailmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAilmentWithPatch() throws Exception {
        // Initialize the database
        ailmentRepository.saveAndFlush(ailment);

        int databaseSizeBeforeUpdate = ailmentRepository.findAll().size();

        // Update the ailment using partial update
        Ailment partialUpdatedAilment = new Ailment();
        partialUpdatedAilment.setId(ailment.getId());

        partialUpdatedAilment.name(UPDATED_NAME);

        restAilmentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAilment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAilment))
            )
            .andExpect(status().isOk());

        // Validate the Ailment in the database
        List<Ailment> ailmentList = ailmentRepository.findAll();
        assertThat(ailmentList).hasSize(databaseSizeBeforeUpdate);
        Ailment testAilment = ailmentList.get(ailmentList.size() - 1);
        assertThat(testAilment.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAilment.getRemoved()).isEqualTo(DEFAULT_REMOVED);
    }

    @Test
    @Transactional
    void fullUpdateAilmentWithPatch() throws Exception {
        // Initialize the database
        ailmentRepository.saveAndFlush(ailment);

        int databaseSizeBeforeUpdate = ailmentRepository.findAll().size();

        // Update the ailment using partial update
        Ailment partialUpdatedAilment = new Ailment();
        partialUpdatedAilment.setId(ailment.getId());

        partialUpdatedAilment.name(UPDATED_NAME).removed(UPDATED_REMOVED);

        restAilmentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAilment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAilment))
            )
            .andExpect(status().isOk());

        // Validate the Ailment in the database
        List<Ailment> ailmentList = ailmentRepository.findAll();
        assertThat(ailmentList).hasSize(databaseSizeBeforeUpdate);
        Ailment testAilment = ailmentList.get(ailmentList.size() - 1);
        assertThat(testAilment.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAilment.getRemoved()).isEqualTo(UPDATED_REMOVED);
    }

    @Test
    @Transactional
    void patchNonExistingAilment() throws Exception {
        int databaseSizeBeforeUpdate = ailmentRepository.findAll().size();
        ailment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAilmentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, ailment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ailment))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ailment in the database
        List<Ailment> ailmentList = ailmentRepository.findAll();
        assertThat(ailmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAilment() throws Exception {
        int databaseSizeBeforeUpdate = ailmentRepository.findAll().size();
        ailment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAilmentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ailment))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ailment in the database
        List<Ailment> ailmentList = ailmentRepository.findAll();
        assertThat(ailmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAilment() throws Exception {
        int databaseSizeBeforeUpdate = ailmentRepository.findAll().size();
        ailment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAilmentMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ailment))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Ailment in the database
        List<Ailment> ailmentList = ailmentRepository.findAll();
        assertThat(ailmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAilment() throws Exception {
        // Initialize the database
        ailmentRepository.saveAndFlush(ailment);

        int databaseSizeBeforeDelete = ailmentRepository.findAll().size();

        // Delete the ailment
        restAilmentMockMvc
            .perform(delete(ENTITY_API_URL_ID, ailment.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Ailment> ailmentList = ailmentRepository.findAll();
        assertThat(ailmentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
