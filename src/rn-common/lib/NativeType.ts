export interface IFilterCallback {
    action: string

    extras: Record<string, string>;

}


export interface IIntent {

    launchIntentForPackage?: string

    bundle?: Record<string, string | boolean | number>

    action: string

    flags: number

    type?: string

    file?: string

    url?: string

    extras?: Record<string, string | boolean | number>,
}

export interface IFilter {

    /**
    * Add a new Intent action to match against.  If any actions are included
    * in the filter, then an Intent's action must be one of those values for
    * it to match.  If no actions are included, the Intent action is ignored.
    *
    * @param action Name of the action to match, such as Intent.ACTION_VIEW.
    */
    action?: string[]

    /**
    * Add a new Intent category to match against.  The semantics of
    * categories is the opposite of actions -- an Intent includes the
    * categories that it requires, all of which must be included in the
    * filter in order to match.  In other words, adding a category to the
    * filter has no impact on matching unless that category is specified in
    * the intent.
    *
    * @param category Name of category to match, such as Intent.CATEGORY_EMBED.
    */
    category?: string[]

    /**
     * Add a new Intent data authority to match against.  The filter must
     * include one or more schemes (via {@link #addDataScheme}) for the
     * authority to be considered.  If any authorities are
     * included in the filter, then an Intent's data must match one of
     * them.  If no authorities are included, then only the scheme must match.
     *
     * <p><em>Note: host name in the Android framework is
     * case-sensitive, unlike formal RFC host names.  As a result,
     * you should always write your host names with lower case letters,
     * and any host names you receive from outside of Android should be
     * converted to lower case before supplying them here.</em></p>
     *
     * @param host The host part of the authority to match.  May start with a
     *             single '*' to wildcard the front of the host name.
     * @param port Optional port part of the authority to match.  If null, any
     *             port is allowed.
     *
     * @see #matchData
     * @see #addDataScheme
     */
    dataAuthority?: { host: string, port: string }[]


    /**
     * Add a new Intent data scheme to match against.  If any schemes are
     * included in the filter, then an Intent's data must be <em>either</em>
     * one of these schemes <em>or</em> a matching data type.  If no schemes
     * are included, then an Intent will match only if it includes no data.
     *
     * <p><em>Note: scheme matching in the Android framework is
     * case-sensitive, unlike formal RFC schemes.  As a result,
     * you should always write your schemes with lower case letters,
     * and any schemes you receive from outside of Android should be
     * converted to lower case before supplying them here.</em></p>
     *
     * @param scheme Name of the scheme to match, such as "http".
     *
     * @see #matchData
     */
    dataScheme?: string[]



    /**
     * Add a new Intent data path to match against.  The filter must
     * include one or more schemes (via {@link #addDataScheme}) <em>and</em>
     * one or more authorities (via {@link #addDataAuthority}) for the
     * path to be considered.  If any paths are
     * included in the filter, then an Intent's data must match one of
     * them.  If no paths are included, then only the scheme/authority must
     * match.
     *
     * <p>The path given here can either be a literal that must directly
     * match or match against a prefix, or it can be a simple globbing pattern.
     * If the latter, you can use '*' anywhere in the pattern to match zero
     * or more instances of the previous character, '.' as a wildcard to match
     * any character, and '\' to escape the next character.
     *
     * @param path Either a raw string that must exactly match the file
     * path, or a simple pattern, depending on <var>type</var>.
     * @param type Determines how <var>path</var> will be compared to
     * determine a match: either {@link PatternMatcher#PATTERN_LITERAL},
     * {@link PatternMatcher#PATTERN_PREFIX}, or
     * {@link PatternMatcher#PATTERN_SIMPLE_GLOB}.
     *
     * @see #matchData
     * @see #addDataScheme
     * @see #addDataAuthority
     */
    dataPath?: { path: string, type: number }[]


    /**
     * Add a new Intent data type to match against.  If any types are
     * included in the filter, then an Intent's data must be <em>either</em>
     * one of these types <em>or</em> a matching scheme.  If no data types
     * are included, then an Intent will only match if it specifies no data.
     *
     * <p><em>Note: MIME type matching in the Android framework is
     * case-sensitive, unlike formal RFC MIME types.  As a result,
     * you should always write your MIME types with lower case letters,
     * and any MIME types you receive from outside of Android should be
     * converted to lower case before supplying them here.</em></p>
     *
     * <p>Throws {@link MalformedMimeTypeException} if the given MIME type is
     * not syntactically correct.
     *
     * @param type Name of the data type to match, such as "vnd.android.cursor.dir/person".
     *
     * @see #matchData
     */
    dataType?: string[]
}