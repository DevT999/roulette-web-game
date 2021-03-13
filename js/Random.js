

Random = function()
{
};

/**
 * Returns the next pseudorandom, uniformly distributed {@code int}
 * value from this random number generator's sequence. The general
 * contract of {@code nextInt} is that one {@code int} value is
 * pseudorandomly generated and returned. All 2<font size="-1"><sup>32
 * </sup></font> possible {@code int} values are produced with
 * (approximately) equal probability.
 *
 * <p>The method {@code nextInt} is implemented by class {@code Random}
 * as if by:
 *  <pre> {@code
 * public int nextInt() {
 *   return next(32);
 * }}</pre>
 *
 * @return the next pseudorandom, uniformly distributed {@code int}
 *         value from this random number generator's sequence
 */
Random.prototype.nextInt = function()
{
	//return MathUtils.random.apply(this, arguments);
	return Math.floor(Math.random() * 0xFFFFFFFF);
}

