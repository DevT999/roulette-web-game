
System = function() {
};

//System.out = new PrintStream();

System.MAX_BUFFER = 0xC000;

/**
 * Returns the current time in milliseconds.  Note that
 * while the unit of time of the return value is a millisecond,
 * the granularity of the value depends on the underlying
 * operating system and may be larger.  For example, many
 * operating systems measure time in units of tens of
 * milliseconds.
 *
 * <p> See the description of the class <code>Date</code> for
 * a discussion of slight discrepancies that may arise between
 * "computer time" and coordinated universal time (UTC).
 *
 * @return  the difference, measured in milliseconds, between
 *          the current time and midnight, January 1, 1970 UTC.
 */
System.currentTimeMillis = function() {
    return new Date().getTime();
};

/**
 * Runs the garbage collector.
 * <p>
 * Calling the <code>gc</code> method suggests that the Java Virtual
 * Machine expend effort toward recycling unused objects in order to
 * make the memory they currently occupy available for quick reuse.
 * When control returns from the method call, the Java Virtual
 * Machine has made a best effort to reclaim space from all discarded
 * objects.
 * <p>
 * The call <code>System.gc()</code> is effectively equivalent to the
 * call:
 * <blockquote><pre>
 * Runtime.getRuntime().gc()
 * </pre></blockquote>
 *
 */
System.gc = function() {
    //do nothing
};

/**
 * Copies an array from the specified source array, beginning at the
 * specified position, to the specified position of the destination array.
 * A subsequence of array components are copied from the source
 * array referenced by <code>src</code> to the destination array
 * referenced by <code>dest</code>. The number of components copied is
 * equal to the <code>length</code> argument. The components at
 * positions <code>srcPos</code> through
 * <code>srcPos+length-1</code> in the source array are copied into
 * positions <code>destPos</code> through
 * <code>destPos+length-1</code>, respectively, of the destination
 * array.
 * <p>
 * If the <code>src</code> and <code>dest</code> arguments refer to the
 * same array object, then the copying is performed as if the
 * components at positions <code>srcPos</code> through
 * <code>srcPos+length-1</code> were first copied to a temporary
 * array with <code>length</code> components and then the contents of
 * the temporary array were copied into positions
 * <code>destPos</code> through <code>destPos+length-1</code> of the
 * destination array.
 * <p>
 * If <code>dest</code> is <code>null</code>, then a
 * <code>NullPointerException</code> is thrown.
 * <p>
 * If <code>src</code> is <code>null</code>, then a
 * <code>NullPointerException</code> is thrown and the destination
 * array is not modified.
 * <p>
 * Otherwise, if any of the following is true, an
 * <code>ArrayStoreException</code> is thrown and the destination is
 * not modified:
 * <ul>
 * <li>The <code>src</code> argument refers to an object that is not an
 *     array.
 * <li>The <code>dest</code> argument refers to an object that is not an
 *     array.
 * <li>The <code>src</code> argument and <code>dest</code> argument refer
 *     to arrays whose component types are different primitive types.
 * <li>The <code>src</code> argument refers to an array with a primitive
 *    component type and the <code>dest</code> argument refers to an array
 *     with a reference component type.
 * <li>The <code>src</code> argument refers to an array with a reference
 *    component type and the <code>dest</code> argument refers to an array
 *     with a primitive component type.
 * </ul>
 * <p>
 * Otherwise, if any of the following is true, an
 * <code>IndexOutOfBoundsException</code> is
 * thrown and the destination is not modified:
 * <ul>
 * <li>The <code>srcPos</code> argument is negative.
 * <li>The <code>destPos</code> argument is negative.
 * <li>The <code>length</code> argument is negative.
 * <li><code>srcPos+length</code> is greater than
 *     <code>src.length</code>, the length of the source array.
 * <li><code>destPos+length</code> is greater than
 *     <code>dest.length</code>, the length of the destination array.
 * </ul>
 * <p>
 * Otherwise, if any actual component of the source array from
 * position <code>srcPos</code> through
 * <code>srcPos+length-1</code> cannot be converted to the component
 * type of the destination array by assignment conversion, an
 * <code>ArrayStoreException</code> is thrown. In this case, let
 * <b><i>k</i></b> be the smallest nonnegative integer less than
 * length such that <code>src[srcPos+</code><i>k</i><code>]</code>
 * cannot be converted to the component type of the destination
 * array; when the exception is thrown, source array components from
 * positions <code>srcPos</code> through
 * <code>srcPos+</code><i>k</i><code>-1</code>
 * will already have been copied to destination array positions
 * <code>destPos</code> through
 * <code>destPos+</code><i>k</I><code>-1</code> and no other
 * positions of the destination array will have been modified.
 * (Because of the restrictions already itemized, this
 * paragraph effectively applies only to the situation where both
 * arrays have component types that are reference types.)
 *
 * @param      src      the source array.
 * @param      soff   starting position in the source array.
 * @param      tgt     the destination array.
 * @param      toff  starting position in the destination data.
 * @param      size   the number of array elements to be copied.
 * @exception  IndexOutOfBoundsException  if copying would cause
 *               access of data outside array bounds.
 * @exception  ArrayStoreException  if an element in the <code>src</code>
 *               array could not be stored into the <code>dest</code> array
 *               because of a type mismatch.
 * @exception  NullPointerException if either <code>src</code> or
 *               <code>dest</code> is <code>null</code>.
 */
System.arraycopy = function(src, soff, tgt, toff, size)
{
	var tpos = toff,
		spos = soff;
	for (var i=0; i < size; i++)
		tgt[tpos++] = src[spos++];
};
/* Truncate original array and Return length-newLength array */
System.arraycopyOf = function(/*byte[]*/ original, /*int*/ newLength) {
    var copy = new_array(1, 0, newLength); 
    System.arraycopy(original, 0, copy, 0,
                     Math.min(original.length, newLength));
    return copy;
};