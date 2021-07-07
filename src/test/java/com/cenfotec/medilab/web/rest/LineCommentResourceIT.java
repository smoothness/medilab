package com.cenfotec.medilab.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.cenfotec.medilab.IntegrationTest;
import com.cenfotec.medilab.domain.LineComment;
import com.cenfotec.medilab.repository.LineCommentRepository;
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
 * Integration tests for the {@link LineCommentResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LineCommentResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Long DEFAULT_QUANTITY = 1L;
    private static final Long UPDATED_QUANTITY = 2L;

    private static final Double DEFAULT_UNIT_PRICE = 1D;
    private static final Double UPDATED_UNIT_PRICE = 2D;

    private static final String ENTITY_API_URL = "/api/line-comments";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LineCommentRepository lineCommentRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLineCommentMockMvc;

    private LineComment lineComment;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LineComment createEntity(EntityManager em) {
        LineComment lineComment = new LineComment()
            .description(DEFAULT_DESCRIPTION)
            .quantity(DEFAULT_QUANTITY)
            .unitPrice(DEFAULT_UNIT_PRICE);
        return lineComment;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LineComment createUpdatedEntity(EntityManager em) {
        LineComment lineComment = new LineComment()
            .description(UPDATED_DESCRIPTION)
            .quantity(UPDATED_QUANTITY)
            .unitPrice(UPDATED_UNIT_PRICE);
        return lineComment;
    }

    @BeforeEach
    public void initTest() {
        lineComment = createEntity(em);
    }

    @Test
    @Transactional
    void createLineComment() throws Exception {
        int databaseSizeBeforeCreate = lineCommentRepository.findAll().size();
        // Create the LineComment
        restLineCommentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(lineComment))
            )
            .andExpect(status().isCreated());

        // Validate the LineComment in the database
        List<LineComment> lineCommentList = lineCommentRepository.findAll();
        assertThat(lineCommentList).hasSize(databaseSizeBeforeCreate + 1);
        LineComment testLineComment = lineCommentList.get(lineCommentList.size() - 1);
        assertThat(testLineComment.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testLineComment.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
        assertThat(testLineComment.getUnitPrice()).isEqualTo(DEFAULT_UNIT_PRICE);
    }

    @Test
    @Transactional
    void createLineCommentWithExistingId() throws Exception {
        // Create the LineComment with an existing ID
        lineComment.setId(1L);

        int databaseSizeBeforeCreate = lineCommentRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLineCommentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(lineComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the LineComment in the database
        List<LineComment> lineCommentList = lineCommentRepository.findAll();
        assertThat(lineCommentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLineComments() throws Exception {
        // Initialize the database
        lineCommentRepository.saveAndFlush(lineComment);

        // Get all the lineCommentList
        restLineCommentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(lineComment.getId().intValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY.intValue())))
            .andExpect(jsonPath("$.[*].unitPrice").value(hasItem(DEFAULT_UNIT_PRICE.doubleValue())));
    }

    @Test
    @Transactional
    void getLineComment() throws Exception {
        // Initialize the database
        lineCommentRepository.saveAndFlush(lineComment);

        // Get the lineComment
        restLineCommentMockMvc
            .perform(get(ENTITY_API_URL_ID, lineComment.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(lineComment.getId().intValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.quantity").value(DEFAULT_QUANTITY.intValue()))
            .andExpect(jsonPath("$.unitPrice").value(DEFAULT_UNIT_PRICE.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingLineComment() throws Exception {
        // Get the lineComment
        restLineCommentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewLineComment() throws Exception {
        // Initialize the database
        lineCommentRepository.saveAndFlush(lineComment);

        int databaseSizeBeforeUpdate = lineCommentRepository.findAll().size();

        // Update the lineComment
        LineComment updatedLineComment = lineCommentRepository.findById(lineComment.getId()).get();
        // Disconnect from session so that the updates on updatedLineComment are not directly saved in db
        em.detach(updatedLineComment);
        updatedLineComment.description(UPDATED_DESCRIPTION).quantity(UPDATED_QUANTITY).unitPrice(UPDATED_UNIT_PRICE);

        restLineCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLineComment.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLineComment))
            )
            .andExpect(status().isOk());

        // Validate the LineComment in the database
        List<LineComment> lineCommentList = lineCommentRepository.findAll();
        assertThat(lineCommentList).hasSize(databaseSizeBeforeUpdate);
        LineComment testLineComment = lineCommentList.get(lineCommentList.size() - 1);
        assertThat(testLineComment.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testLineComment.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testLineComment.getUnitPrice()).isEqualTo(UPDATED_UNIT_PRICE);
    }

    @Test
    @Transactional
    void putNonExistingLineComment() throws Exception {
        int databaseSizeBeforeUpdate = lineCommentRepository.findAll().size();
        lineComment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLineCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, lineComment.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(lineComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the LineComment in the database
        List<LineComment> lineCommentList = lineCommentRepository.findAll();
        assertThat(lineCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLineComment() throws Exception {
        int databaseSizeBeforeUpdate = lineCommentRepository.findAll().size();
        lineComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLineCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(lineComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the LineComment in the database
        List<LineComment> lineCommentList = lineCommentRepository.findAll();
        assertThat(lineCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLineComment() throws Exception {
        int databaseSizeBeforeUpdate = lineCommentRepository.findAll().size();
        lineComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLineCommentMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(lineComment))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LineComment in the database
        List<LineComment> lineCommentList = lineCommentRepository.findAll();
        assertThat(lineCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLineCommentWithPatch() throws Exception {
        // Initialize the database
        lineCommentRepository.saveAndFlush(lineComment);

        int databaseSizeBeforeUpdate = lineCommentRepository.findAll().size();

        // Update the lineComment using partial update
        LineComment partialUpdatedLineComment = new LineComment();
        partialUpdatedLineComment.setId(lineComment.getId());

        partialUpdatedLineComment.quantity(UPDATED_QUANTITY);

        restLineCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLineComment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLineComment))
            )
            .andExpect(status().isOk());

        // Validate the LineComment in the database
        List<LineComment> lineCommentList = lineCommentRepository.findAll();
        assertThat(lineCommentList).hasSize(databaseSizeBeforeUpdate);
        LineComment testLineComment = lineCommentList.get(lineCommentList.size() - 1);
        assertThat(testLineComment.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testLineComment.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testLineComment.getUnitPrice()).isEqualTo(DEFAULT_UNIT_PRICE);
    }

    @Test
    @Transactional
    void fullUpdateLineCommentWithPatch() throws Exception {
        // Initialize the database
        lineCommentRepository.saveAndFlush(lineComment);

        int databaseSizeBeforeUpdate = lineCommentRepository.findAll().size();

        // Update the lineComment using partial update
        LineComment partialUpdatedLineComment = new LineComment();
        partialUpdatedLineComment.setId(lineComment.getId());

        partialUpdatedLineComment.description(UPDATED_DESCRIPTION).quantity(UPDATED_QUANTITY).unitPrice(UPDATED_UNIT_PRICE);

        restLineCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLineComment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLineComment))
            )
            .andExpect(status().isOk());

        // Validate the LineComment in the database
        List<LineComment> lineCommentList = lineCommentRepository.findAll();
        assertThat(lineCommentList).hasSize(databaseSizeBeforeUpdate);
        LineComment testLineComment = lineCommentList.get(lineCommentList.size() - 1);
        assertThat(testLineComment.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testLineComment.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testLineComment.getUnitPrice()).isEqualTo(UPDATED_UNIT_PRICE);
    }

    @Test
    @Transactional
    void patchNonExistingLineComment() throws Exception {
        int databaseSizeBeforeUpdate = lineCommentRepository.findAll().size();
        lineComment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLineCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, lineComment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(lineComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the LineComment in the database
        List<LineComment> lineCommentList = lineCommentRepository.findAll();
        assertThat(lineCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLineComment() throws Exception {
        int databaseSizeBeforeUpdate = lineCommentRepository.findAll().size();
        lineComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLineCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(lineComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the LineComment in the database
        List<LineComment> lineCommentList = lineCommentRepository.findAll();
        assertThat(lineCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLineComment() throws Exception {
        int databaseSizeBeforeUpdate = lineCommentRepository.findAll().size();
        lineComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLineCommentMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(lineComment))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LineComment in the database
        List<LineComment> lineCommentList = lineCommentRepository.findAll();
        assertThat(lineCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLineComment() throws Exception {
        // Initialize the database
        lineCommentRepository.saveAndFlush(lineComment);

        int databaseSizeBeforeDelete = lineCommentRepository.findAll().size();

        // Delete the lineComment
        restLineCommentMockMvc
            .perform(delete(ENTITY_API_URL_ID, lineComment.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<LineComment> lineCommentList = lineCommentRepository.findAll();
        assertThat(lineCommentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
