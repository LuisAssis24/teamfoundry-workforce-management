package com.teamfoundry.backend;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class SampleServiceTest {

	@Mock
	private SampleRepository sampleRepository;

	@InjectMocks
	private SampleService sampleService;

	@Test
	void findNameReturnsValueFromRepository() {
		when(sampleRepository.findNameById(42L)).thenReturn(Optional.of("TeamFoundry"));

		String result = sampleService.findName(42L);

		assertThat(result).isEqualTo("TeamFoundry");
		verify(sampleRepository).findNameById(42L);
	}

	interface SampleRepository {
		Optional<String> findNameById(Long id);
	}

	static class SampleService {
		private final SampleRepository sampleRepository;

		SampleService(SampleRepository sampleRepository) {
			this.sampleRepository = sampleRepository;
		}

		String findName(Long id) {
			return sampleRepository.findNameById(id)
				.orElseThrow(() -> new IllegalArgumentException("Unknown id: " + id));
		}
	}
}
