import { RatePipe } from './rate.pipe';

describe('RatePipe', () => {
  it('create an instance', () => {
    const pipe = new RatePipe();
    expect(pipe).toBeTruthy();
  });

  it('Rate should work correctly', () => {
    const pipe = new RatePipe();
    // Given
    const salary = 135200;
    const expectedRate = 65;
    // When
    const result = pipe.transform(salary);
    // Then
    expect(result).toEqual(expectedRate);
  });

  it('Rate should return same value with the same input', () => {
    const pipe = new RatePipe();
    // Given
    const salary = 500000;
    // When
    const result1 = pipe.transform(salary);
    const result2 = pipe.transform(salary);
    // Then
    expect(result1).toEqual(result2);
  });
});
