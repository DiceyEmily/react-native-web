export class AndroidIntent {


    /**
        * If set, the recipient of this Intent will be granted permission to
        * perform read operations on the URI in the Intent's data and any URIs
        * specified in its ClipData.  When applying to an Intent's ClipData,
        * all URIs as well as recursive traversals through data or other ClipData
        * in Intent items will be granted; only the grant flags of the top-level
        * Intent are used.
        */
    public static FLAG_GRANT_READ_URI_PERMISSION = 0x00000001;
    /**
     * If set, the recipient of this Intent will be granted permission to
     * perform write operations on the URI in the Intent's data and any URIs
     * specified in its ClipData.  When applying to an Intent's ClipData,
     * all URIs as well as recursive traversals through data or other ClipData
     * in Intent items will be granted; only the grant flags of the top-level
     * Intent are used.
     */
    public static FLAG_GRANT_WRITE_URI_PERMISSION = 0x00000002;
    /**
     * Can be set by the caller to indicate that this Intent is coming from
     * a background operation, not from direct user interaction.
     */
    public static FLAG_FROM_BACKGROUND = 0x00000004;
    /**
     * A flag you can enable for debugging: when set, log messages will be
     * printed during the resolution of this intent to show you what has
     * been found to create the final resolved list.
     */
    public static FLAG_DEBUG_LOG_RESOLUTION = 0x00000008;
    /**
     * If set, this intent will not match any components in packages that
     * are currently stopped.  If this is not set, then the default behavior
     * is to include such applications in the result.
     */
    public static FLAG_EXCLUDE_STOPPED_PACKAGES = 0x00000010;
    /**
     * If set, this intent will always match any components in packages that
     * are currently stopped.  This is the default behavior when
     * {@link #FLAG_EXCLUDE_STOPPED_PACKAGES} is not set.  If both of these
     * flags are set, this one wins (it allows overriding of exclude for
     * places where the framework may automatically set the exclude flag).
     */
    public static FLAG_INCLUDE_STOPPED_PACKAGES = 0x00000020;

    /**
     * When combined with {@link #FLAG_GRANT_READ_URI_PERMISSION} and/or
     * {@link #FLAG_GRANT_WRITE_URI_PERMISSION}, the URI permission grant can be
     * persisted across device reboots until explicitly revoked with
     * {@link Context#revokeUriPermission(Uri, int)}. This flag only offers the
     * grant for possible persisting; the receiving application must call
     * {@link ContentResolver#takePersistableUriPermission(Uri, int)} to
     * actually persist.
     *
     * @see ContentResolver#takePersistableUriPermission(Uri, int)
     * @see ContentResolver#releasePersistableUriPermission(Uri, int)
     * @see ContentResolver#getPersistedUriPermissions()
     * @see ContentResolver#getOutgoingPersistedUriPermissions()
     */
    public static FLAG_GRANT_PERSISTABLE_URI_PERMISSION = 0x00000040;

    /**
     * When combined with {@link #FLAG_GRANT_READ_URI_PERMISSION} and/or
     * {@link #FLAG_GRANT_WRITE_URI_PERMISSION}, the URI permission grant
     * applies to any URI that is a prefix match against the original granted
     * URI. (Without this flag, the URI must match exactly for access to be
     * granted.) Another URI is considered a prefix match only when scheme,
     * authority, and all path segments defined by the prefix are an exact
     * match.
     */
    public static FLAG_GRANT_PREFIX_URI_PERMISSION = 0x00000080;

    /**
     * Internal flag used to indicate that a system component has done their
     * homework and verified that they correctly handle packages and components
     * that come and go over time. In particular:
     * <ul>
     * <li>Apps installed on external storage, which will appear to be
     * uninstalled while the the device is ejected.
     * <li>Apps with encryption unaware components, which will appear to not
     * exist while the device is locked.
     * </ul>
     *
     * @hide
     */
    public static FLAG_DEBUG_TRIAGED_MISSING = 0x00000100;

    /**
     * Internal flag used to indicate ephemeral applications should not be
     * considered when resolving the intent.
     *
     * @hide
     */
    public static FLAG_IGNORE_EPHEMERAL = 0x00000200;

    /**
     * If set, the new activity is not kept in the history stack.  As soon as
     * the user navigates away from it, the activity is finished.  This may also
     * be set with the {@link android.R.styleable#AndroidManifestActivity_noHistory
     * noHistory} attribute.
     *
     * <p>If set, {@link android.app.Activity#onActivityResult onActivityResult()}
     * is never invoked when the current activity starts a new activity which
     * sets a result and finishes.
     */
    public static FLAG_ACTIVITY_NO_HISTORY = 0x40000000;
    /**
     * If set, the activity will not be launched if it is already running
     * at the top of the history stack.
     */
    public static FLAG_ACTIVITY_SINGLE_TOP = 0x20000000;
    /**
     * If set, this activity will become the start of a new task on this
     * history stack.  A task (from the activity that started it to the
     * next task activity) defines an atomic group of activities that the
     * user can move to.  Tasks can be moved to the foreground and background;
     * all of the activities inside of a particular task always remain in
     * the same order.  See
     * <a href="{@docRoot}guide/topics/fundamentals/tasks-and-back-stack.html">Tasks and Back
     * Stack</a> for more information about tasks.
     *
     * <p>This flag is generally used by activities that want
     * to present a "launcher" style behavior: they give the user a list of
     * separate things that can be done, which otherwise run completely
     * independently of the activity launching them.
     *
     * <p>When using this flag, if a task is already running for the activity
     * you are now starting, then a new activity will not be started; instead,
     * the current task will simply be brought to the front of the screen with
     * the state it was last in.  See {@link #FLAG_ACTIVITY_MULTIPLE_TASK} for a flag
     * to disable this behavior.
     *
     * <p>This flag can not be used when the caller is requesting a result from
     * the activity being launched.
     */
    public static FLAG_ACTIVITY_NEW_TASK = 0x10000000;
    /**
     * This flag is used to create a new task and launch an activity into it.
     * This flag is always paired with either {@link #FLAG_ACTIVITY_NEW_DOCUMENT}
     * or {@link #FLAG_ACTIVITY_NEW_TASK}. In both cases these flags alone would
     * search through existing tasks for ones matching this Intent. Only if no such
     * task is found would a new task be created. When paired with
     * FLAG_ACTIVITY_MULTIPLE_TASK both of these behaviors are modified to skip
     * the search for a matching task and unconditionally start a new task.
     *
     * <strong>When used with {@link #FLAG_ACTIVITY_NEW_TASK} do not use this
     * flag unless you are implementing your own
     * top-level application launcher.</strong>  Used in conjunction with
     * {@link #FLAG_ACTIVITY_NEW_TASK} to disable the
     * behavior of bringing an existing task to the foreground.  When set,
     * a new task is <em>always</em> started to host the Activity for the
     * Intent, regardless of whether there is already an existing task running
     * the same thing.
     *
     * <p><strong>Because the default system does not include graphical task management,
     * you should not use this flag unless you provide some way for a user to
     * return back to the tasks you have launched.</strong>
     *
     * See {@link #FLAG_ACTIVITY_NEW_DOCUMENT} for details of this flag's use for
     * creating new document tasks.
     *
     * <p>This flag is ignored if one of {@link #FLAG_ACTIVITY_NEW_TASK} or
     * {@link #FLAG_ACTIVITY_NEW_DOCUMENT} is not also set.
     *
     * <p>See
     * <a href="{@docRoot}guide/topics/fundamentals/tasks-and-back-stack.html">Tasks and Back
     * Stack</a> for more information about tasks.
     *
     * @see #FLAG_ACTIVITY_NEW_DOCUMENT
     * @see #FLAG_ACTIVITY_NEW_TASK
     */
    public static FLAG_ACTIVITY_MULTIPLE_TASK = 0x08000000;
    /**
     * If set, and the activity being launched is already running in the
     * current task, then instead of launching a new instance of that activity,
     * all of the other activities on top of it will be closed and this Intent
     * will be delivered to the (now on top) old activity as a new Intent.
     *
     * <p>For example, consider a task consisting of the activities: A, B, C, D.
     * If D calls startActivity() with an Intent that resolves to the component
     * of activity B, then C and D will be finished and B receive the given
     * Intent, resulting in the stack now being: A, B.
     *
     * <p>The currently running instance of activity B in the above example will
     * either receive the new intent you are starting here in its
     * onNewIntent() method, or be itself finished and restarted with the
     * new intent.  If it has declared its launch mode to be "multiple" (the
     * default) and you have not set {@link #FLAG_ACTIVITY_SINGLE_TOP} in
     * the same intent, then it will be finished and re-created; for all other
     * launch modes or if {@link #FLAG_ACTIVITY_SINGLE_TOP} is set then this
     * Intent will be delivered to the current instance's onNewIntent().
     *
     * <p>This launch mode can also be used to good effect in conjunction with
     * {@link #FLAG_ACTIVITY_NEW_TASK}: if used to start the root activity
     * of a task, it will bring any currently running instance of that task
     * to the foreground, and then clear it to its root state.  This is
     * especially useful, for example, when launching an activity from the
     * notification manager.
     *
     * <p>See
     * <a href="{@docRoot}guide/topics/fundamentals/tasks-and-back-stack.html">Tasks and Back
     * Stack</a> for more information about tasks.
     */
    public static FLAG_ACTIVITY_CLEAR_TOP = 0x04000000;
    /**
     * If set and this intent is being used to launch a new activity from an
     * existing one, then the reply target of the existing activity will be
     * transfered to the new activity.  This way the new activity can call
     * {@link android.app.Activity#setResult} and have that result sent back to
     * the reply target of the original activity.
     */
    public static FLAG_ACTIVITY_FORWARD_RESULT = 0x02000000;
    /**
     * If set and this intent is being used to launch a new activity from an
     * existing one, the current activity will not be counted as the top
     * activity for deciding whether the new intent should be delivered to
     * the top instead of starting a new one.  The previous activity will
     * be used as the top, with the assumption being that the current activity
     * will finish itself immediately.
     */
    public static FLAG_ACTIVITY_PREVIOUS_IS_TOP = 0x01000000;
    /**
     * If set, the new activity is not kept in the list of recently launched
     * activities.
     */
    public static FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS = 0x00800000;
    /**
     * This flag is not normally set by application code, but set for you by
     * the system as described in the
     * {@link android.R.styleable#AndroidManifestActivity_launchMode
     * launchMode} documentation for the singleTask mode.
     */
    public static FLAG_ACTIVITY_BROUGHT_TO_FRONT = 0x00400000;
    /**
     * If set, and this activity is either being started in a new task or
     * bringing to the top an existing task, then it will be launched as
     * the front door of the task.  This will result in the application of
     * any affinities needed to have that task in the proper state (either
     * moving activities to or from it), or simply resetting that task to
     * its initial state if needed.
     */
    public static FLAG_ACTIVITY_RESET_TASK_IF_NEEDED = 0x00200000;
    /**
     * This flag is not normally set by application code, but set for you by
     * the system if this activity is being launched from history
     * (longpress home key).
     */
    public static FLAG_ACTIVITY_LAUNCHED_FROM_HISTORY = 0x00100000;


    /**
     * @deprecated As of API 21 this performs identically to
     * {@link #FLAG_ACTIVITY_NEW_DOCUMENT} which should be used instead of this.
     */
    public static FLAG_ACTIVITY_CLEAR_WHEN_TASK_RESET = 0x00080000;



    /**
     * This flag is used to open a document into a new task rooted at the activity launched
     * by this Intent. Through the use of this flag, or its equivalent attribute,
     * {@link android.R.attr#documentLaunchMode} multiple instances of the same activity
     * containing different documents will appear in the recent tasks list.
     *
     * <p>The use of the activity attribute form of this,
     * {@link android.R.attr#documentLaunchMode}, is
     * preferred over the Intent flag described here. The attribute form allows the
     * Activity to specify multiple document behavior for all launchers of the Activity
     * whereas using this flag requires each Intent that launches the Activity to specify it.
     *
     * <p>Note that the default semantics of this flag w.r.t. whether the recents entry for
     * it is kept after the activity is finished is different than the use of
     * {@link #FLAG_ACTIVITY_NEW_TASK} and {@link android.R.attr#documentLaunchMode} -- if
     * this flag is being used to create a new recents entry, then by default that entry
     * will be removed once the activity is finished.  You can modify this behavior with
     * {@link #FLAG_ACTIVITY_RETAIN_IN_RECENTS}.
     *
     * <p>FLAG_ACTIVITY_NEW_DOCUMENT may be used in conjunction with {@link
     * #FLAG_ACTIVITY_MULTIPLE_TASK}. When used alone it is the
     * equivalent of the Activity manifest specifying {@link
     * android.R.attr#documentLaunchMode}="intoExisting". When used with
     * FLAG_ACTIVITY_MULTIPLE_TASK it is the equivalent of the Activity manifest specifying
     * {@link android.R.attr#documentLaunchMode}="always".
     *
     * Refer to {@link android.R.attr#documentLaunchMode} for more information.
     *
     * @see android.R.attr#documentLaunchMode
     * @see #FLAG_ACTIVITY_MULTIPLE_TASK
     */
    public static FLAG_ACTIVITY_NEW_DOCUMENT = AndroidIntent.FLAG_ACTIVITY_CLEAR_WHEN_TASK_RESET;
    /**
     * If set, this flag will prevent the normal {@link android.app.Activity#onUserLeaveHint}
     * callback from occurring on the current frontmost activity before it is
     * paused as the newly-started activity is brought to the front.
     *
     * <p>Typically, an activity can rely on that callback to indicate that an
     * explicit user action has caused their activity to be moved out of the
     * foreground. The callback marks an appropriate point in the activity's
     * lifecycle for it to dismiss any notifications that it intends to display
     * "until the user has seen them," such as a blinking LED.
     *
     * <p>If an activity is ever started via any non-user-driven events such as
     * phone-call receipt or an alarm handler, this flag should be passed to {@link
     * Context#startActivity Context.startActivity}, ensuring that the pausing
     * activity does not think the user has acknowledged its notification.
     */
    public static FLAG_ACTIVITY_NO_USER_ACTION = 0x00040000;
    /**
     * If set in an Intent passed to {@link Context#startActivity Context.startActivity()},
     * this flag will cause the launched activity to be brought to the front of its
     * task's history stack if it is already running.
     *
     * <p>For example, consider a task consisting of four activities: A, B, C, D.
     * If D calls startActivity() with an Intent that resolves to the component
     * of activity B, then B will be brought to the front of the history stack,
     * with this resulting order:  A, C, D, B.
     *
     * This flag will be ignored if {@link #FLAG_ACTIVITY_CLEAR_TOP} is also
     * specified.
     */
    public static FLAG_ACTIVITY_REORDER_TO_FRONT = 0X00020000;
    /**
     * If set in an Intent passed to {@link Context#startActivity Context.startActivity()},
     * this flag will prevent the system from applying an activity transition
     * animation to go to the next activity state.  This doesn't mean an
     * animation will never run -- if another activity change happens that doesn't
     * specify this flag before the activity started here is displayed, then
     * that transition will be used.  This flag can be put to good use
     * when you are going to do a series of activity operations but the
     * animation seen by the user shouldn't be driven by the first activity
     * change but rather a later one.
     */
    public static FLAG_ACTIVITY_NO_ANIMATION = 0X00010000;
    /**
     * If set in an Intent passed to {@link Context#startActivity Context.startActivity()},
     * this flag will cause any existing task that would be associated with the
     * activity to be cleared before the activity is started.  That is, the activity
     * becomes the new root of an otherwise empty task, and any old activities
     * are finished.  This can only be used in conjunction with {@link #FLAG_ACTIVITY_NEW_TASK}.
     */
    public static FLAG_ACTIVITY_CLEAR_TASK = 0X00008000;
    /**
     * If set in an Intent passed to {@link Context#startActivity Context.startActivity()},
     * this flag will cause a newly launching task to be placed on top of the current
     * home activity task (if there is one).  That is, pressing back from the task
     * will always return the user to home even if that was not the last activity they
     * saw.   This can only be used in conjunction with {@link #FLAG_ACTIVITY_NEW_TASK}.
     */
    public static FLAG_ACTIVITY_TASK_ON_HOME = 0X00004000;
    /**
     * By default a document created by {@link #FLAG_ACTIVITY_NEW_DOCUMENT} will
     * have its entry in recent tasks removed when the user closes it (with back
     * or however else it may finish()). If you would like to instead allow the
     * document to be kept in recents so that it can be re-launched, you can use
     * this flag. When set and the task's activity is finished, the recents
     * entry will remain in the interface for the user to re-launch it, like a
     * recents entry for a top-level application.
     * <p>
     * The receiving activity can override this request with
     * {@link android.R.attr#autoRemoveFromRecents} or by explcitly calling
     * {@link android.app.Activity#finishAndRemoveTask()
     * Activity.finishAndRemoveTask()}.
     */
    public static FLAG_ACTIVITY_RETAIN_IN_RECENTS = 0x00002000;

    /**
     * This flag is only used in split-screen multi-window mode. The new activity will be displayed
     * adjacent to the one launching it. This can only be used in conjunction with
     * {@link #FLAG_ACTIVITY_NEW_TASK}. Also, setting {@link #FLAG_ACTIVITY_MULTIPLE_TASK} is
     * required if you want a new instance of an existing activity to be created.
     */
    public static FLAG_ACTIVITY_LAUNCH_ADJACENT = 0x00001000;


    /**
     * If set in an Intent passed to {@link Context#startActivity Context.startActivity()},
     * this flag will attempt to launch an instant app if no full app on the device can already
     * handle the intent.
     * <p>
     * When attempting to resolve instant apps externally, the following {@link Intent} properties
     * are supported:
     * <ul>
     *     <li>{@link Intent#setAction(String)}</li>
     *     <li>{@link Intent#addCategory(String)}</li>
     *     <li>{@link Intent#setData(Uri)}</li>
     *     <li>{@link Intent#setType(String)}</li>
     *     <li>{@link Intent#setPackage(String)}</li>
     *     <li>{@link Intent#addFlags(int)}</li>
     * </ul>
     * <p>
     * In the case that no instant app can be found, the installer will be launched to notify the
     * user that the intent could not be resolved. On devices that do not support instant apps,
     * the flag will be ignored.
     */
    public static FLAG_ACTIVITY_MATCH_EXTERNAL = 0x00000800;

    /**
     * If set, when sending a broadcast only registered receivers will be
     * called -- no BroadcastReceiver components will be launched.
     */
    public static FLAG_RECEIVER_REGISTERED_ONLY = 0x40000000;
    /**
     * If set, when sending a broadcast the new broadcast will replace
     * any existing pending broadcast that matches it.  Matching is defined
     * by {@link Intent#filterEquals(Intent) Intent.filterEquals} returning
     * true for the intents of the two broadcasts.  When a match is found,
     * the new broadcast (and receivers associated with it) will replace the
     * existing one in the pending broadcast list, remaining at the same
     * position in the list.
     *
     * <p>This flag is most typically used with sticky broadcasts, which
     * only care about delivering the most recent values of the broadcast
     * to their receivers.
     */
    public static FLAG_RECEIVER_REPLACE_PENDING = 0x20000000;
    /**
     * If set, when sending a broadcast the recipient is allowed to run at
     * foreground priority, with a shorter timeout interval.  During normal
     * broadcasts the receivers are not automatically hoisted out of the
     * background priority class.
     */
    public static FLAG_RECEIVER_FOREGROUND = 0x10000000;
    /**
     * If this is an ordered broadcast, don't allow receivers to abort the broadcast.
     * They can still propagate results through to later receivers, but they can not prevent
     * later receivers from seeing the broadcast.
     */
    public static FLAG_RECEIVER_NO_ABORT = 0x08000000;
    /**
     * If set, when sending a broadcast <i>before boot has completed</i> only
     * registered receivers will be called -- no BroadcastReceiver components
     * will be launched.  Sticky intent state will be recorded properly even
     * if no receivers wind up being called.  If {@link #FLAG_RECEIVER_REGISTERED_ONLY}
     * is specified in the broadcast intent, this flag is unnecessary.
     *
     * <p>This flag is only for use by system sevices as a convenience to
     * avoid having to implement a more complex mechanism around detection
     * of boot completion.
     *
     * @hide
     */
    public static FLAG_RECEIVER_REGISTERED_ONLY_BEFORE_BOOT = 0x04000000;
    /**
     * Set when this broadcast is for a boot upgrade, a special mode that
     * allows the broadcast to be sent before the system is ready and launches
     * the app process with no providers running in it.
     * @hide
     */
    public static FLAG_RECEIVER_BOOT_UPGRADE = 0x02000000;
    /**
     * If set, the broadcast will always go to manifest receivers in background (cached
     * or not running) apps, regardless of whether that would be done by default.  By
     * default they will only receive broadcasts if the broadcast has specified an
     * explicit component or package name.
     *
     * NOTE: dumpstate uses this flag numerically, so when its value is changed
     * the broadcast code there must also be changed to match.
     *
     * @hide
     */
    public static FLAG_RECEIVER_INCLUDE_BACKGROUND = 0x01000000;
    /**
     * If set, the broadcast will never go to manifest receivers in background (cached
     * or not running) apps, regardless of whether that would be done by default.  By
     * default they will receive broadcasts if the broadcast has specified an
     * explicit component or package name.
     * @hide
     */
    public static FLAG_RECEIVER_EXCLUDE_BACKGROUND = 0x00800000;
    /**
     * If set, this broadcast is being sent from the shell.
     * @hide
     */
    public static FLAG_RECEIVER_FROM_SHELL = 0x00400000;

    /**
     * If set, the broadcast will be visible to receivers in Instant Apps. By default Instant Apps
     * will not receive broadcasts.
     *
     * <em>This flag has no effect when used by an Instant App.</em>
     */
    public static FLAG_RECEIVER_VISIBLE_TO_INSTANT_APPS = 0x00200000;

    /**
       *  Activity Action: Start as a main entry point, does not expect to
       *  receive data.
       *  <p>Input: nothing
       *  <p>Output: nothing
       */

    public static ACTION_MAIN = "android.intent.action.MAIN";

    /**
     * Activity Action: Display the data to the user.  This is the most common
     * action performed on data -- it is the generic action you can use on
     * a piece of data to get the most reasonable thing to occur.  For example,
     * when used on a contacts entry it will view the entry; when used on a
     * mailto: URI it will bring up a compose window filled with the information
     * supplied by the URI; when used with a tel: URI it will invoke the
     * dialer.
     * <p>Input: {@link #getData} is URI from which to retrieve data.
     * <p>Output: nothing.
     */

    public static ACTION_VIEW = "android.intent.action.VIEW";

    /**
     * Extra that can be included on activity intents coming from the storage UI
     * when it launches sub-activities to manage various types of storage.  For example,
     * it may use {@link #ACTION_VIEW} with a "image/*" MIME type to have an app show
     * the images on the device, and in that case also include this extra to tell the
     * app it is coming from the storage UI so should help the user manage storage of
     * this type.
     */
    public static EXTRA_FROM_STORAGE = "android.intent.extra.FROM_STORAGE";


    /**
     * Activity Action: Quick view the data. Launches a quick viewer for
     * a URI or a list of URIs.
     * <p>Activities handling this intent action should handle the vast majority of
     * MIME types rather than only specific ones.
     * <p>Quick viewers must render the quick view image locally, and must not send
     * file content outside current device.
     * <p>Input: {@link #getData} is a mandatory content URI of the item to
     * preview. {@link #getClipData} contains an optional list of content URIs
     * if there is more than one item to preview. {@link #EXTRA_INDEX} is an
     * optional index of the URI in the clip data to show first.
     * {@link #EXTRA_QUICK_VIEW_FEATURES} is an optional extra indicating the features
     * that can be shown in the quick view UI.
     * <p>Output: nothing.
     * @see #EXTRA_INDEX
     * @see #EXTRA_QUICK_VIEW_FEATURES
     */

    public static ACTION_QUICK_VIEW = "android.intent.action.QUICK_VIEW";

    /**
     * Used to indicate that some piece of data should be attached to some other
     * place.  For example, image data could be attached to a contact.  It is up
     * to the recipient to decide where the data should be attached; the intent
     * does not specify the ultimate destination.
     * <p>Input: {@link #getData} is URI of data to be attached.
     * <p>Output: nothing.
     */

    public static ACTION_ATTACH_DATA = "android.intent.action.ATTACH_DATA";

    /**
     * Activity Action: Provide explicit editable access to the given data.
     * <p>Input: {@link #getData} is URI of data to be edited.
     * <p>Output: nothing.
     */

    public static ACTION_EDIT = "android.intent.action.EDIT";

    /**
     * Activity Action: Pick an existing item, or insert a new item, and then edit it.
     * <p>Input: {@link #getType} is the desired MIME type of the item to create or edit.
     * The extras can contain type specific data to pass through to the editing/creating
     * activity.
     * <p>Output: The URI of the item that was picked.  This must be a content:
     * URI so that any receiver can access it.
     */

    public static ACTION_INSERT_OR_EDIT = "android.intent.action.INSERT_OR_EDIT";

    /**
     * Activity Action: Pick an item from the data, returning what was selected.
     * <p>Input: {@link #getData} is URI containing a directory of data
     * (vnd.android.cursor.dir/*) from which to pick an item.
     * <p>Output: The URI of the item that was picked.
     */

    public static ACTION_PICK = "android.intent.action.PICK";

    /**
     * Activity Action: Creates a shortcut.
     * <p>Input: Nothing.</p>
     * <p>Output: An Intent representing the {@link android.content.pm.ShortcutInfo} result.</p>
     * <p>For compatibility with older versions of android the intent may also contain three
     * extras: SHORTCUT_INTENT (value: Intent), SHORTCUT_NAME (value: String),
     * and SHORTCUT_ICON (value: Bitmap) or SHORTCUT_ICON_RESOURCE
     * (value: ShortcutIconResource).</p>
     *
     * @see android.content.pm.ShortcutManager#createShortcutResultIntent
     * @see #EXTRA_SHORTCUT_INTENT
     * @see #EXTRA_SHORTCUT_NAME
     * @see #EXTRA_SHORTCUT_ICON
     * @see #EXTRA_SHORTCUT_ICON_RESOURCE
     * @see android.content.Intent.ShortcutIconResource
     */

    public static ACTION_CREATE_SHORTCUT = "android.intent.action.CREATE_SHORTCUT";


    /**
     * An activity that provides a user interface for adjusting application preferences.
     * Optional but recommended settings for all applications which have settings.
     */

    public static ACTION_APPLICATION_PREFERENCES
        = "android.intent.action.APPLICATION_PREFERENCES";

    /**
     * Activity Action: Launch an activity showing the app information.
     * For applications which install other applications (such as app stores), it is recommended
     * to handle this action for providing the app information to the user.
     *
     * <p>Input: {@link #EXTRA_PACKAGE_NAME} specifies the package whose information needs
     * to be displayed.
     * <p>Output: Nothing.
     */

    public static ACTION_SHOW_APP_INFO
        = "android.intent.action.SHOW_APP_INFO";





    // ---------------------------------------------------------------------
    // ---------------------------------------------------------------------
    // Standard intent categories (see addCategory()).

    /**
     * Set if the activity should be an option for the default action
     * (center press) to perform on a piece of data.  Setting this will
     * hide from the user any activities without it set when performing an
     * action on some data.  Note that this is normally -not- set in the
     * Intent when initiating an action -- it is for use in intent filters
     * specified in packages.
     */

    public static CATEGORY_DEFAULT = "android.intent.category.DEFAULT";
    /**
     * Activities that can be safely invoked from a browser must support this
     * category.  For example, if the user is viewing a web page or an e-mail
     * and clicks on a link in the text, the Intent generated execute that
     * link will require the BROWSABLE category, so that only activities
     * supporting this category will be considered as possible actions.  By
     * supporting this category, you are promising that there is nothing
     * damaging (without user intervention) that can happen by invoking any
     * matching Intent.
     */

    public static CATEGORY_BROWSABLE = "android.intent.category.BROWSABLE";
    /**
     * Categories for activities that can participate in voice interaction.
     * An activity that supports this category must be prepared to run with
     * no UI shown at all (though in some case it may have a UI shown), and
     * rely on {@link android.app.VoiceInteractor} to interact with the user.
     */

    public static CATEGORY_VOICE = "android.intent.category.VOICE";
    /**
     * Set if the activity should be considered as an alternative action to
     * the data the user is currently viewing.  See also
     * {@link #CATEGORY_SELECTED_ALTERNATIVE} for an alternative action that
     * applies to the selection in a list of items.
     *
     * <p>Supporting this category means that you would like your activity to be
     * displayed in the set of alternative things the user can do, usually as
     * part of the current activity's options menu.  You will usually want to
     * include a specific label in the &lt;intent-filter&gt; of this action
     * describing to the user what it does.
     *
     * <p>The action of IntentFilter with this category is important in that it
     * describes the specific action the target will perform.  This generally
     * should not be a generic action (such as {@link #ACTION_VIEW}, but rather
     * a specific name such as "com.android.camera.action.CROP.  Only one
     * alternative of any particular action will be shown to the user, so using
     * a specific action like this makes sure that your alternative will be
     * displayed while also allowing other applications to provide their own
     * overrides of that particular action.
     */

    public static CATEGORY_ALTERNATIVE = "android.intent.category.ALTERNATIVE";
    /**
     * Set if the activity should be considered as an alternative selection
     * action to the data the user has currently selected.  This is like
     * {@link #CATEGORY_ALTERNATIVE}, but is used in activities showing a list
     * of items from which the user can select, giving them alternatives to the
     * default action that will be performed on it.
     */

    public static CATEGORY_SELECTED_ALTERNATIVE = "android.intent.category.SELECTED_ALTERNATIVE";
    /**
     * Intended to be used as a tab inside of a containing TabActivity.
     */

    public static CATEGORY_TAB = "android.intent.category.TAB";
    /**
     * Should be displayed in the top-level launcher.
     */

    public static CATEGORY_LAUNCHER = "android.intent.category.LAUNCHER";
    /**
     * Indicates an activity optimized for Leanback mode, and that should
     * be displayed in the Leanback launcher.
     */

    public static CATEGORY_LEANBACK_LAUNCHER = "android.intent.category.LEANBACK_LAUNCHER";
    /**
     * Indicates the preferred entry-point activity when an application is launched from a Car
     * launcher. If not present, Car launcher can optionally use {@link #CATEGORY_LAUNCHER} as a
     * fallback, or exclude the application entirely.
     * @hide
     */

    public static CATEGORY_CAR_LAUNCHER = "android.intent.category.CAR_LAUNCHER";
    /**
     * Indicates a Leanback settings activity to be displayed in the Leanback launcher.
     * @hide
     */

    public static CATEGORY_LEANBACK_SETTINGS = "android.intent.category.LEANBACK_SETTINGS";
    /**
     * Provides information about the package it is in; typically used if
     * a package does not contain a {@link #CATEGORY_LAUNCHER} to provide
     * a front-door to the user without having to be shown in the all apps list.
     */

    public static CATEGORY_INFO = "android.intent.category.INFO";
    /**
     * This is the home activity, that is the first activity that is displayed
     * when the device boots.
     */

    public static CATEGORY_HOME = "android.intent.category.HOME";
    /**
     * This is the home activity that is displayed when the device is finished setting up and ready
     * for use.
     * @hide
     */

    public static CATEGORY_HOME_MAIN = "android.intent.category.HOME_MAIN";
    /**
     * This is the setup wizard activity, that is the first activity that is displayed
     * when the user sets up the device for the first time.
     * @hide
     */

    public static CATEGORY_SETUP_WIZARD = "android.intent.category.SETUP_WIZARD";
    /**
     * This is the home activity, that is the activity that serves as the launcher app
     * from there the user can start other apps. Often components with lower/higher
     * priority intent filters handle the home intent, for example SetupWizard, to
     * setup the device and we need to be able to distinguish the home app from these
     * setup helpers.
     * @hide
     */

    public static CATEGORY_LAUNCHER_APP = "android.intent.category.LAUNCHER_APP";
    /**
     * This activity is a preference panel.
     */

    public static CATEGORY_PREFERENCE = "android.intent.category.PREFERENCE";
    /**
     * This activity is a development preference panel.
     */

    public static CATEGORY_DEVELOPMENT_PREFERENCE = "android.intent.category.DEVELOPMENT_PREFERENCE";
    /**
     * Capable of running inside a parent activity container.
     */

    public static CATEGORY_EMBED = "android.intent.category.EMBED";
    /**
     * This activity allows the user to browse and download new applications.
     */

    public static CATEGORY_APP_MARKET = "android.intent.category.APP_MARKET";
    /**
     * This activity may be exercised by the monkey or other automated test tools.
     */

    public static CATEGORY_MONKEY = "android.intent.category.MONKEY";
    /**
     * To be used as a test (not part of the normal user experience).
     */
    public static CATEGORY_TEST = "android.intent.category.TEST";
    /**
     * To be used as a unit test (run through the Test Harness).
     */
    public static CATEGORY_UNIT_TEST = "android.intent.category.UNIT_TEST";
    /**
     * To be used as a sample code example (not part of the normal user
     * experience).
     */
    public static CATEGORY_SAMPLE_CODE = "android.intent.category.SAMPLE_CODE";

    /**
     * Used to indicate that an intent only wants URIs that can be opened with
     * {@link ContentResolver#openFileDescriptor(Uri, String)}. Openable URIs
     * must support at least the columns defined in {@link OpenableColumns} when
     * queried.
     *
     * @see #ACTION_GET_CONTENT
     * @see #ACTION_OPEN_DOCUMENT
     * @see #ACTION_CREATE_DOCUMENT
     */

    public static CATEGORY_OPENABLE = "android.intent.category.OPENABLE";

    /**
     * Used to indicate that an intent filter can accept files which are not necessarily
     * openable by {@link ContentResolver#openFileDescriptor(Uri, String)}, but
     * at least streamable via
     * {@link ContentResolver#openTypedAssetFileDescriptor(Uri, String, Bundle)}
     * using one of the stream types exposed via
     * {@link ContentResolver#getStreamTypes(Uri, String)}.
     *
     * @see #ACTION_SEND
     * @see #ACTION_SEND_MULTIPLE
     */

    public static CATEGORY_TYPED_OPENABLE =
        "android.intent.category.TYPED_OPENABLE";

    /**
     * To be used as code under test for framework instrumentation tests.
     */
    public static CATEGORY_FRAMEWORK_INSTRUMENTATION_TEST =
        "android.intent.category.FRAMEWORK_INSTRUMENTATION_TEST";
    /**
     * An activity to run when device is inserted into a car dock.
     * Used with {@link #ACTION_MAIN} to launch an activity.  For more
     * information, see {@link android.app.UiModeManager}.
     */

    public static CATEGORY_CAR_DOCK = "android.intent.category.CAR_DOCK";
    /**
     * An activity to run when device is inserted into a car dock.
     * Used with {@link #ACTION_MAIN} to launch an activity.  For more
     * information, see {@link android.app.UiModeManager}.
     */

    public static CATEGORY_DESK_DOCK = "android.intent.category.DESK_DOCK";
    /**
     * An activity to run when device is inserted into a analog (low end) dock.
     * Used with {@link #ACTION_MAIN} to launch an activity.  For more
     * information, see {@link android.app.UiModeManager}.
     */

    public static CATEGORY_LE_DESK_DOCK = "android.intent.category.LE_DESK_DOCK";

    /**
     * An activity to run when device is inserted into a digital (high end) dock.
     * Used with {@link #ACTION_MAIN} to launch an activity.  For more
     * information, see {@link android.app.UiModeManager}.
     */

    public static CATEGORY_HE_DESK_DOCK = "android.intent.category.HE_DESK_DOCK";

    /**
     * Used to indicate that the activity can be used in a car environment.
     */

    public static CATEGORY_CAR_MODE = "android.intent.category.CAR_MODE";

    /**
     * An activity to use for the launcher when the device is placed in a VR Headset viewer.
     * Used with {@link #ACTION_MAIN} to launch an activity.  For more
     * information, see {@link android.app.UiModeManager}.
     */

    public static CATEGORY_VR_HOME = "android.intent.category.VR_HOME";
    // ---------------------------------------------------------------------
    // ---------------------------------------------------------------------
    // Application launch intent categories (see addCategory()).

    /**
     * Used with {@link #ACTION_MAIN} to launch the browser application.
     * The activity should be able to browse the Internet.
     * <p>NOTE: This should not be used as the primary key of an Intent,
     * since it will not result in the app launching with the correct
     * action and category.  Instead, use this with
     * {@link #makeMainSelectorActivity(String, String)} to generate a main
     * Intent with this category in the selector.</p>
     */

    public static CATEGORY_APP_BROWSER = "android.intent.category.APP_BROWSER";

    /**
     * Used with {@link #ACTION_MAIN} to launch the calculator application.
     * The activity should be able to perform standard arithmetic operations.
     * <p>NOTE: This should not be used as the primary key of an Intent,
     * since it will not result in the app launching with the correct
     * action and category.  Instead, use this with
     * {@link #makeMainSelectorActivity(String, String)} to generate a main
     * Intent with this category in the selector.</p>
     */

    public static CATEGORY_APP_CALCULATOR = "android.intent.category.APP_CALCULATOR";

    /**
     * Used with {@link #ACTION_MAIN} to launch the calendar application.
     * The activity should be able to view and manipulate calendar entries.
     * <p>NOTE: This should not be used as the primary key of an Intent,
     * since it will not result in the app launching with the correct
     * action and category.  Instead, use this with
     * {@link #makeMainSelectorActivity(String, String)} to generate a main
     * Intent with this category in the selector.</p>
     */

    public static CATEGORY_APP_CALENDAR = "android.intent.category.APP_CALENDAR";

    /**
     * Used with {@link #ACTION_MAIN} to launch the contacts application.
     * The activity should be able to view and manipulate address book entries.
     * <p>NOTE: This should not be used as the primary key of an Intent,
     * since it will not result in the app launching with the correct
     * action and category.  Instead, use this with
     * {@link #makeMainSelectorActivity(String, String)} to generate a main
     * Intent with this category in the selector.</p>
     */

    public static CATEGORY_APP_CONTACTS = "android.intent.category.APP_CONTACTS";

    /**
     * Used with {@link #ACTION_MAIN} to launch the email application.
     * The activity should be able to send and receive email.
     * <p>NOTE: This should not be used as the primary key of an Intent,
     * since it will not result in the app launching with the correct
     * action and category.  Instead, use this with
     * {@link #makeMainSelectorActivity(String, String)} to generate a main
     * Intent with this category in the selector.</p>
     */

    public static CATEGORY_APP_EMAIL = "android.intent.category.APP_EMAIL";

    /**
     * Used with {@link #ACTION_MAIN} to launch the gallery application.
     * The activity should be able to view and manipulate image and video files
     * stored on the device.
     * <p>NOTE: This should not be used as the primary key of an Intent,
     * since it will not result in the app launching with the correct
     * action and category.  Instead, use this with
     * {@link #makeMainSelectorActivity(String, String)} to generate a main
     * Intent with this category in the selector.</p>
     */

    public static CATEGORY_APP_GALLERY = "android.intent.category.APP_GALLERY";

    /**
     * Used with {@link #ACTION_MAIN} to launch the maps application.
     * The activity should be able to show the user's current location and surroundings.
     * <p>NOTE: This should not be used as the primary key of an Intent,
     * since it will not result in the app launching with the correct
     * action and category.  Instead, use this with
     * {@link #makeMainSelectorActivity(String, String)} to generate a main
     * Intent with this category in the selector.</p>
     */

    public static CATEGORY_APP_MAPS = "android.intent.category.APP_MAPS";

    /**
     * Used with {@link #ACTION_MAIN} to launch the messaging application.
     * The activity should be able to send and receive text messages.
     * <p>NOTE: This should not be used as the primary key of an Intent,
     * since it will not result in the app launching with the correct
     * action and category.  Instead, use this with
     * {@link #makeMainSelectorActivity(String, String)} to generate a main
     * Intent with this category in the selector.</p>
     */

    public static CATEGORY_APP_MESSAGING = "android.intent.category.APP_MESSAGING";

    /**
     * Used with {@link #ACTION_MAIN} to launch the music application.
     * The activity should be able to play, browse, or manipulate music files
     * stored on the device.
     * <p>NOTE: This should not be used as the primary key of an Intent,
     * since it will not result in the app launching with the correct
     * action and category.  Instead, use this with
     * {@link #makeMainSelectorActivity(String, String)} to generate a main
     * Intent with this category in the selector.</p>
     */

    public static CATEGORY_APP_MUSIC = "android.intent.category.APP_MUSIC";
}



export class AndroidSdk {
    /**
       * October 2008: The original, first, version of Android.  Yay!
       */
    public static BASE = 1;

    /**
     * February 2009: First Android update, officially called 1.1.
     */
    public static BASE_1_1 = 2;

    /**
     * May 2009: Android 1.5.
     */
    public static CUPCAKE = 3;

    /**
     * September 2009: Android 1.6.
     *
     * <p>Applications targeting this or a later release will get these
     * new changes in behavior:</p>
     * <ul>
     * <li> They must explicitly request the
     * {@link android.Manifest.permission#WRITE_EXTERNAL_STORAGE} permission to be
     * able to modify the contents of the SD card.  (Apps targeting
     * earlier versions will always request the permission.)
     * <li> They must explicitly request the
     * {@link android.Manifest.permission#READ_PHONE_STATE} permission to be
     * able to be able to retrieve phone state info.  (Apps targeting
     * earlier versions will always request the permission.)
     * <li> They are assumed to support different screen densities and
     * sizes.  (Apps targeting earlier versions are assumed to only support
     * medium density normal size screens unless otherwise indicated).
     * They can still explicitly specify screen support either way with the
     * supports-screens manifest tag.
     * <li> {@link android.widget.TabHost} will use the new dark tab
     * background design.
     * </ul>
     */
    public static DONUT = 4;

    /**
     * November 2009: Android 2.0
     *
     * <p>Applications targeting this or a later release will get these
     * new changes in behavior:</p>
     * <ul>
     * <li> The {@link android.app.Service#onStartCommand
     * Service.onStartCommand} function will return the new
     * {@link android.app.Service#START_STICKY} behavior instead of the
     * old compatibility {@link android.app.Service#START_STICKY_COMPATIBILITY}.
     * <li> The {@link android.app.Activity} class will now execute back
     * key presses on the key up instead of key down, to be able to detect
     * canceled presses from virtual keys.
     * <li> The {@link android.widget.TabWidget} class will use a new color scheme
     * for tabs. In the new scheme, the foreground tab has a medium gray background
     * the background tabs have a dark gray background.
     * </ul>
     */
    public static ECLAIR = 5;

    /**
     * December 2009: Android 2.0.1
     */
    public static ECLAIR_0_1 = 6;

    /**
     * January 2010: Android 2.1
     */
    public static ECLAIR_MR1 = 7;

    /**
     * June 2010: Android 2.2
     */
    public static FROYO = 8;

    /**
     * November 2010: Android 2.3
     *
     * <p>Applications targeting this or a later release will get these
     * new changes in behavior:</p>
     * <ul>
     * <li> The application's notification icons will be shown on the new
     * dark status bar background, so must be visible in this situation.
     * </ul>
     */
    public static GINGERBREAD = 9;

    /**
     * February 2011: Android 2.3.3.
     */
    public static GINGERBREAD_MR1 = 10;

    /**
     * February 2011: Android 3.0.
     *
     * <p>Applications targeting this or a later release will get these
     * new changes in behavior:</p>
     * <ul>
     * <li> The default theme for applications is now dark holographic:
     *      {@link android.R.style#Theme_Holo}.
     * <li> On large screen devices that do not have a physical menu
     * button, the soft (compatibility) menu is disabled.
     * <li> The activity lifecycle has changed slightly as per
     * {@link android.app.Activity}.
     * <li> An application will crash if it does not call through
     * to the super implementation of its
     * {@link android.app.Activity#onPause Activity.onPause()} method.
     * <li> When an application requires a permission to access one of
     * its components (activity, receiver, service, provider), this
     * permission is no longer enforced when the application wants to
     * access its own component.  This means it can require a permission
     * on a component that it does not itself hold and still access that
     * component.
     * <li> {@link android.content.Context#getSharedPreferences
     * Context.getSharedPreferences()} will not automatically reload
     * the preferences if they have changed on storage, unless
     * {@link android.content.Context#MODE_MULTI_PROCESS} is used.
     * <li> {@link android.view.ViewGroup#setMotionEventSplittingEnabled}
     * will default to true.
     * <li> {@link android.view.WindowManager.LayoutParams#FLAG_SPLIT_TOUCH}
     * is enabled by default on windows.
     * <li> {@link android.widget.PopupWindow#isSplitTouchEnabled()
     * PopupWindow.isSplitTouchEnabled()} will return true by default.
     * <li> {@link android.widget.GridView} and {@link android.widget.ListView}
     * will use {@link android.view.View#setActivated View.setActivated}
     * for selected items if they do not implement {@link android.widget.Checkable}.
     * <li> {@link android.widget.Scroller} will be constructed with
     * "flywheel" behavior enabled by default.
     * </ul>
     */
    public static HONEYCOMB = 11;

    /**
     * May 2011: Android 3.1.
     */
    public static HONEYCOMB_MR1 = 12;

    /**
     * June 2011: Android 3.2.
     *
     * <p>Update to Honeycomb MR1 to support 7 inch tablets, improve
     * screen compatibility mode, etc.</p>
     *
     * <p>As of this version, applications that don't say whether they
     * support XLARGE screens will be assumed to do so only if they target
     * {@link #HONEYCOMB} or later; it had been {@link #GINGERBREAD} or
     * later.  Applications that don't support a screen size at least as
     * large as the current screen will provide the user with a UI to
     * switch them in to screen size compatibility mode.</p>
     *
     * <p>This version introduces new screen size resource qualifiers
     * based on the screen size in dp: see
     * {@link android.content.res.Configuration#screenWidthDp},
     * {@link android.content.res.Configuration#screenHeightDp}, and
     * {@link android.content.res.Configuration#smallestScreenWidthDp}.
     * Supplying these in &lt;supports-screens&gt; as per
     * {@link android.content.pm.ApplicationInfo#requiresSmallestWidthDp},
     * {@link android.content.pm.ApplicationInfo#compatibleWidthLimitDp}, and
     * {@link android.content.pm.ApplicationInfo#largestWidthLimitDp} is
     * preferred over the older screen size buckets and for older devices
     * the appropriate buckets will be inferred from them.</p>
     *
     * <p>Applications targeting this or a later release will get these
     * new changes in behavior:</p>
     * <ul>
     * <li><p>New {@link android.content.pm.PackageManager#FEATURE_SCREEN_PORTRAIT}
     * and {@link android.content.pm.PackageManager#FEATURE_SCREEN_LANDSCAPE}
     * features were introduced in this release.  Applications that target
     * previous platform versions are assumed to require both portrait and
     * landscape support in the device; when targeting Honeycomb MR1 or
     * greater the application is responsible for specifying any specific
     * orientation it requires.</p>
     * <li><p>{@link android.os.AsyncTask} will use the serial executor
     * by default when calling {@link android.os.AsyncTask#execute}.</p>
     * <li><p>{@link android.content.pm.ActivityInfo#configChanges
     * ActivityInfo.configChanges} will have the
     * {@link android.content.pm.ActivityInfo#CONFIG_SCREEN_SIZE} and
     * {@link android.content.pm.ActivityInfo#CONFIG_SMALLEST_SCREEN_SIZE}
     * bits set; these need to be cleared for older applications because
     * some developers have done absolute comparisons against this value
     * instead of correctly masking the bits they are interested in.
     * </ul>
     */
    public static HONEYCOMB_MR2 = 13;

    /**
     * October 2011: Android 4.0.
     *
     * <p>Applications targeting this or a later release will get these
     * new changes in behavior:</p>
     * <ul>
     * <li> For devices without a dedicated menu key, the software compatibility
     * menu key will not be shown even on phones.  By targeting Ice Cream Sandwich
     * or later, your UI must always have its own menu UI affordance if needed,
     * on both tablets and phones.  The ActionBar will take care of this for you.
     * <li> 2d drawing hardware acceleration is now turned on by default.
     * You can use
     * {@link android.R.attr#hardwareAccelerated android:hardwareAccelerated}
     * to turn it off if needed, although this is strongly discouraged since
     * it will result in poor performance on larger screen devices.
     * <li> The default theme for applications is now the "device default" theme:
     *      {@link android.R.style#Theme_DeviceDefault}. This may be the
     *      holo dark theme or a different dark theme defined by the specific device.
     *      The {@link android.R.style#Theme_Holo} family must not be modified
     *      for a device to be considered compatible. Applications that explicitly
     *      request a theme from the Holo family will be guaranteed that these themes
     *      will not change character within the same platform version. Applications
     *      that wish to blend in with the device should use a theme from the
     *      {@link android.R.style#Theme_DeviceDefault} family.
     * <li> Managed cursors can now throw an exception if you directly close
     * the cursor yourself without stopping the management of it; previously failures
     * would be silently ignored.
     * <li> The fadingEdge attribute on views will be ignored (fading edges is no
     * longer a standard part of the UI).  A new requiresFadingEdge attribute allows
     * applications to still force fading edges on for special cases.
     * <li> {@link android.content.Context#bindService Context.bindService()}
     * will not automatically add in {@link android.content.Context#BIND_WAIVE_PRIORITY}.
     * <li> App Widgets will have standard padding automatically added around
     * them, rather than relying on the padding being baked into the widget itself.
     * <li> An exception will be thrown if you try to change the type of a
     * window after it has been added to the window manager.  Previously this
     * would result in random incorrect behavior.
     * <li> {@link android.view.animation.AnimationSet} will parse out
     * the duration, fillBefore, fillAfter, repeatMode, and startOffset
     * XML attributes that are defined.
     * <li> {@link android.app.ActionBar#setHomeButtonEnabled
     * ActionBar.setHomeButtonEnabled()} is false by default.
     * </ul>
     */
    public static ICE_CREAM_SANDWICH = 14;

    /**
     * December 2011: Android 4.0.3.
     */
    public static ICE_CREAM_SANDWICH_MR1 = 15;

    /**
     * June 2012: Android 4.1.
     *
     * <p>Applications targeting this or a later release will get these
     * new changes in behavior:</p>
     * <ul>
     * <li> You must explicitly request the {@link android.Manifest.permission#READ_CALL_LOG}
     * and/or {@link android.Manifest.permission#WRITE_CALL_LOG} permissions;
     * access to the call log is no longer implicitly provided through
     * {@link android.Manifest.permission#READ_CONTACTS} and
     * {@link android.Manifest.permission#WRITE_CONTACTS}.
     * <li> {@link android.widget.RemoteViews} will throw an exception if
     * setting an onClick handler for views being generated by a
     * {@link android.widget.RemoteViewsService} for a collection container;
     * previously this just resulted in a warning log message.
     * <li> New {@link android.app.ActionBar} policy for embedded tabs:
     * embedded tabs are now always stacked in the action bar when in portrait
     * mode, regardless of the size of the screen.
     * <li> {@link android.webkit.WebSettings#setAllowFileAccessFromFileURLs(boolean)
     * WebSettings.setAllowFileAccessFromFileURLs} and
     * {@link android.webkit.WebSettings#setAllowUniversalAccessFromFileURLs(boolean)
     * WebSettings.setAllowUniversalAccessFromFileURLs} default to false.
     * <li> Calls to {@link android.content.pm.PackageManager#setComponentEnabledSetting
     * PackageManager.setComponentEnabledSetting} will now throw an
     * IllegalArgumentException if the given component class name does not
     * exist in the application's manifest.
     * <li> {@link android.nfc.NfcAdapter#setNdefPushMessage
     * NfcAdapter.setNdefPushMessage},
     * {@link android.nfc.NfcAdapter#setNdefPushMessageCallback
     * NfcAdapter.setNdefPushMessageCallback} and
     * {@link android.nfc.NfcAdapter#setOnNdefPushCompleteCallback
     * NfcAdapter.setOnNdefPushCompleteCallback} will throw
     * IllegalStateException if called after the Activity has been destroyed.
     * <li> Accessibility services must require the new
     * {@link android.Manifest.permission#BIND_ACCESSIBILITY_SERVICE} permission or
     * they will not be available for use.
     * <li> {@link android.accessibilityservice.AccessibilityServiceInfo#FLAG_INCLUDE_NOT_IMPORTANT_VIEWS
     * AccessibilityServiceInfo.FLAG_INCLUDE_NOT_IMPORTANT_VIEWS} must be set
     * for unimportant views to be included in queries.
     * </ul>
     */
    public static JELLY_BEAN = 16;

    /**
     * November 2012: Android 4.2, Moar jelly beans!
     *
     * <p>Applications targeting this or a later release will get these
     * new changes in behavior:</p>
     * <ul>
     * <li>Content Providers: The default value of {@code android:exported} is now
     * {@code false}. See
     * <a href="{@docRoot}guide/topics/manifest/provider-element.html#exported">
     * the android:exported section</a> in the provider documentation for more details.</li>
     * <li>{@link android.view.View#getLayoutDirection() View.getLayoutDirection()}
     * can return different values than {@link android.view.View#LAYOUT_DIRECTION_LTR}
     * based on the locale etc.
     * <li> {@link android.webkit.WebView#addJavascriptInterface(Object, String)
     * WebView.addJavascriptInterface} requires explicit annotations on methods
     * for them to be accessible from Javascript.
     * </ul>
     */
    public static JELLY_BEAN_MR1 = 17;

    /**
     * July 2013: Android 4.3, the revenge of the beans.
     */
    public static JELLY_BEAN_MR2 = 18;

    /**
     * October 2013: Android 4.4, KitKat, another tasty treat.
     *
     * <p>Applications targeting this or a later release will get these
     * new changes in behavior:</p>
     * <ul>
     * <li> The default result of
     * {@link android.preference.PreferenceActivity#isValidFragment(String)
     * PreferenceActivity.isValueFragment} becomes false instead of true.</li>
     * <li> In {@link android.webkit.WebView}, apps targeting earlier versions will have
     * JS URLs evaluated directly and any result of the evaluation will not replace
     * the current page content.  Apps targetting KITKAT or later that load a JS URL will
     * have the result of that URL replace the content of the current page</li>
     * <li> {@link android.app.AlarmManager#set AlarmManager.set} becomes interpreted as
     * an inexact value, to give the system more flexibility in scheduling alarms.</li>
     * <li> {@link android.content.Context#getSharedPreferences(String, int)
     * Context.getSharedPreferences} no longer allows a null name.</li>
     * <li> {@link android.widget.RelativeLayout} changes to compute wrapped content
     * margins correctly.</li>
     * <li> {@link android.app.ActionBar}'s window content overlay is allowed to be
     * drawn.</li>
     * <li>The {@link android.Manifest.permission#READ_EXTERNAL_STORAGE}
     * permission is now always enforced.</li>
     * <li>Access to package-specific external storage directories belonging
     * to the calling app no longer requires the
     * {@link android.Manifest.permission#READ_EXTERNAL_STORAGE} or
     * {@link android.Manifest.permission#WRITE_EXTERNAL_STORAGE}
     * permissions.</li>
     * </ul>
     */
    public static KITKAT = 19;

    /**
     * June 2014: Android 4.4W. KitKat for watches, snacks on the run.
     *
     * <p>Applications targeting this or a later release will get these
     * new changes in behavior:</p>
     * <ul>
     * <li>{@link android.app.AlertDialog} might not have a default background if the theme does
     * not specify one.</li>
     * </ul>
     */
    public static KITKAT_WATCH = 20;

    /**
     * Temporary until we completely switch to {@link #LOLLIPOP}.
     * @hide
     */
    public static L = 21;

    /**
     * November 2014: Lollipop.  A flat one with beautiful shadows.  But still tasty.
     *
     * <p>Applications targeting this or a later release will get these
     * new changes in behavior:</p>
     * <ul>
     * <li> {@link android.content.Context#bindService Context.bindService} now
     * requires an explicit Intent, and will throw an exception if given an implicit
     * Intent.</li>
     * <li> {@link android.app.Notification.Builder Notification.Builder} will
     * not have the colors of their various notification elements adjusted to better
     * match the new material design look.</li>
     * <li> {@link android.os.Message} will validate that a message is not currently
     * in use when it is recycled.</li>
     * <li> Hardware accelerated drawing in windows will be enabled automatically
     * in most places.</li>
     * <li> {@link android.widget.Spinner} throws an exception if attaching an
     * adapter with more than one item type.</li>
     * <li> If the app is a launcher, the launcher will be available to the user
     * even when they are using corporate profiles (which requires that the app
     * use {@link android.content.pm.LauncherApps} to correctly populate its
     * apps UI).</li>
     * <li> Calling {@link android.app.Service#stopForeground Service.stopForeground}
     * with removeNotification false will modify the still posted notification so that
     * it is no longer forced to be ongoing.</li>
     * <li> A {@link android.service.dreams.DreamService} must require the
     * {@link android.Manifest.permission#BIND_DREAM_SERVICE} permission to be usable.</li>
     * </ul>
     */
    public static LOLLIPOP = 21;

    /**
     * March 2015: Lollipop with an extra sugar coating on the outside!
     */
    public static LOLLIPOP_MR1 = 22;

    /**
     * M is for Marshmallow!
     *
     * <p>Applications targeting this or a later release will get these
     * new changes in behavior:</p>
     * <ul>
     * <li> Runtime permissions.  Dangerous permissions are no longer granted at
     * install time, but must be requested by the application at runtime through
     * {@link android.app.Activity#requestPermissions}.</li>
     * <li> Bluetooth and Wi-Fi scanning now requires holding the location permission.</li>
     * <li> {@link android.app.AlarmManager#setTimeZone AlarmManager.setTimeZone} will fail if
     * the given timezone is non-Olson.</li>
     * <li> Activity transitions will only return shared
     * elements mapped in the returned view hierarchy back to the calling activity.</li>
     * <li> {@link android.view.View} allows a number of behaviors that may break
     * existing apps: Canvas throws an exception if restore() is called too many times,
     * widgets may return a hint size when returning UNSPECIFIED measure specs, and it
     * will respect the attributes {@link android.R.attr#foreground},
     * {@link android.R.attr#foregroundGravity}, {@link android.R.attr#foregroundTint}, and
     * {@link android.R.attr#foregroundTintMode}.</li>
     * <li> {@link android.view.MotionEvent#getButtonState MotionEvent.getButtonState}
     * will no longer report {@link android.view.MotionEvent#BUTTON_PRIMARY}
     * and {@link android.view.MotionEvent#BUTTON_SECONDARY} as synonyms for
     * {@link android.view.MotionEvent#BUTTON_STYLUS_PRIMARY} and
     * {@link android.view.MotionEvent#BUTTON_STYLUS_SECONDARY}.</li>
     * <li> {@link android.widget.ScrollView} now respects the layout param margins
     * when measuring.</li>
     * </ul>
     */
    public static M = 23;

    /**
     * N is for Nougat.
     *
     * <p>Applications targeting this or a later release will get these
     * new changes in behavior:</p>
     * <ul>
     * <li> {@link android.app.DownloadManager.Request#setAllowedNetworkTypes
     * DownloadManager.Request.setAllowedNetworkTypes}
     * will disable "allow over metered" when specifying only
     * {@link android.app.DownloadManager.Request#NETWORK_WIFI}.</li>
     * <li> {@link android.app.DownloadManager} no longer allows access to raw
     * file paths.</li>
     * <li> {@link android.app.Notification.Builder#setShowWhen
     * Notification.Builder.setShowWhen}
     * must be called explicitly to have the time shown, and various other changes in
     * {@link android.app.Notification.Builder Notification.Builder} to how notifications
     * are shown.</li>
     * <li>{@link android.content.Context#MODE_WORLD_READABLE} and
     * {@link android.content.Context#MODE_WORLD_WRITEABLE} are no longer supported.</li>
     * <li>{@link android.os.FileUriExposedException} will be thrown to applications.</li>
     * <li>Applications will see global drag and drops as per
     * {@link android.view.View#DRAG_FLAG_GLOBAL}.</li>
     * <li>{@link android.webkit.WebView#evaluateJavascript WebView.evaluateJavascript}
     * will not persist state from an empty WebView.</li>
     * <li>{@link android.animation.AnimatorSet} will not ignore calls to end() before
     * start().</li>
     * <li>{@link android.app.AlarmManager#cancel(android.app.PendingIntent)
     * AlarmManager.cancel} will throw a NullPointerException if given a null operation.</li>
     * <li>{@link android.app.FragmentManager} will ensure fragments have been created
     * before being placed on the back stack.</li>
     * <li>{@link android.app.FragmentManager} restores fragments in
     * {@link android.app.Fragment#onCreate Fragment.onCreate} rather than after the
     * method returns.</li>
     * <li>{@link android.R.attr#resizeableActivity} defaults to true.</li>
     * <li>{@link android.graphics.drawable.AnimatedVectorDrawable} throws exceptions when
     * opening invalid VectorDrawable animations.</li>
     * <li>{@link android.view.ViewGroup.MarginLayoutParams} will no longer be dropped
     * when converting between some types of layout params (such as
     * {@link android.widget.LinearLayout.LayoutParams LinearLayout.LayoutParams} to
     * {@link android.widget.RelativeLayout.LayoutParams RelativeLayout.LayoutParams}).</li>
     * <li>Your application processes will not be killed when the device density changes.</li>
     * <li>Drag and drop. After a view receives the
     * {@link android.view.DragEvent#ACTION_DRAG_ENTERED} event, when the drag shadow moves into
     * a descendant view that can accept the data, the view receives the
     * {@link android.view.DragEvent#ACTION_DRAG_EXITED} event and won’t receive
     * {@link android.view.DragEvent#ACTION_DRAG_LOCATION} and
     * {@link android.view.DragEvent#ACTION_DROP} events while the drag shadow is within that
     * descendant view, even if the descendant view returns <code>false</code> from its handler
     * for these events.</li>
     * </ul>
     */
    public static N = 24;

    /**
     * N MR1: Nougat++.
     */
    public static N_MR1 = 25;



    /**
     * O.
     *
     * <p>Applications targeting this or a later release will get these
     * new changes in behavior:</p>
     * <ul>
     * <li><a href="{@docRoot}about/versions/oreo/background.html">Background execution limits</a>
     * are applied to the application.</li>
     * <li>The behavior of AccountManager's
     * {@link android.accounts.AccountManager#getAccountsByType},
     * {@link android.accounts.AccountManager#getAccountsByTypeAndFeatures}, and
     * {@link android.accounts.AccountManager#hasFeatures} has changed as documented there.</li>
     * <li>{@link android.app.ActivityManager.RunningAppProcessInfo#IMPORTANCE_PERCEPTIBLE_PRE_26}
     * is now returned as
     * {@link android.app.ActivityManager.RunningAppProcessInfo#IMPORTANCE_PERCEPTIBLE}.</li>
     * <li>The {@link android.app.NotificationManager} now requires the use of notification
     * channels.</li>
     * <li>Changes to the strict mode that are set in
     * {@link Application#onCreate Application.onCreate} will no longer be clobbered after
     * that function returns.</li>
     * <li>A shared library apk with native code will have that native code included in
     * the library path of its clients.</li>
     * <li>{@link android.content.Context#getSharedPreferences Context.getSharedPreferences}
     * in credential encrypted storage will throw an exception before the user is unlocked.</li>
     * <li>Attempting to retrieve a {@link Context#FINGERPRINT_SERVICE} on a device that
     * does not support that feature will now throw a runtime exception.</li>
     * <li>{@link android.app.Fragment} will stop any active view animations when
     * the fragment is stopped.</li>
     * <li>Some compatibility code in Resources that attempts to use the default Theme
     * the app may be using will be turned off, requiring the app to explicitly request
     * resources with the right theme.</li>
     * <li>{@link android.content.ContentResolver#notifyChange ContentResolver.notifyChange} and
     * {@link android.content.ContentResolver#registerContentObserver
     * ContentResolver.registerContentObserver}
     * will throw a SecurityException if the caller does not have permission to access
     * the provider (or the provider doesn't exit); otherwise the call will be silently
     * ignored.</li>
     * <li>{@link android.hardware.camera2.CameraDevice#createCaptureRequest
     * CameraDevice.createCaptureRequest} will enable
     * {@link android.hardware.camera2.CaptureRequest#CONTROL_ENABLE_ZSL} by default for
     * still image capture.</li>
     * <li>WallpaperManager's {@link android.app.WallpaperManager#getWallpaperFile},
     * {@link android.app.WallpaperManager#getDrawable},
     * {@link android.app.WallpaperManager#getFastDrawable},
     * {@link android.app.WallpaperManager#peekDrawable}, and
     * {@link android.app.WallpaperManager#peekFastDrawable} will throw an exception
     * if you can not access the wallpaper.</li>
     * <li>The behavior of
     * {@link android.hardware.usb.UsbDeviceConnection#requestWait UsbDeviceConnection.requestWait}
     * is modified as per the documentation there.</li>
     * <li>{@link StrictMode.VmPolicy.Builder#detectAll StrictMode.VmPolicy.Builder.detectAll}
     * will also enable {@link StrictMode.VmPolicy.Builder#detectContentUriWithoutPermission}
     * and {@link StrictMode.VmPolicy.Builder#detectUntaggedSockets}.</li>
     * <li>{@link StrictMode.ThreadPolicy.Builder#detectAll StrictMode.ThreadPolicy.Builder.detectAll}
     * will also enable {@link StrictMode.ThreadPolicy.Builder#detectUnbufferedIo}.</li>
     * <li>{@link android.provider.DocumentsContract}'s various methods will throw failure
     * exceptions back to the caller instead of returning null.
     * <li>{@link View#hasFocusable View.hasFocusable} now includes auto-focusable views.</li>
     * <li>{@link android.view.SurfaceView} will no longer always change the underlying
     * Surface object when something about it changes; apps need to look at the current
     * state of the object to determine which things they are interested in have changed.</li>
     * <li>{@link android.view.WindowManager.LayoutParams#TYPE_APPLICATION_OVERLAY} must be
     * used for overlay windows, other system overlay window types are not allowed.</li>
     * <li>{@link android.view.ViewTreeObserver#addOnDrawListener
     * ViewTreeObserver.addOnDrawListener} will throw an exception if called from within
     * onDraw.</li>
     * <li>{@link android.graphics.Canvas#setBitmap Canvas.setBitmap} will no longer preserve
     * the current matrix and clip stack of the canvas.</li>
     * <li>{@link android.widget.ListPopupWindow#setHeight ListPopupWindow.setHeight}
     * will throw an exception if a negative height is supplied.</li>
     * <li>{@link android.widget.TextView} will use internationalized input for numbers,
     * dates, and times.</li>
     * <li>{@link android.widget.Toast} must be used for showing toast windows; the toast
     * window type can not be directly used.</li>
     * <li>{@link android.net.wifi.WifiManager#getConnectionInfo WifiManager.getConnectionInfo}
     * requires that the caller hold the location permission to return BSSID/SSID</li>
     * <li>{@link android.net.wifi.p2p.WifiP2pManager#requestPeers WifiP2pManager.requestPeers}
     * requires the caller hold the location permission.</li>
     * <li>{@link android.R.attr#maxAspectRatio} defaults to 0, meaning there is no restriction
     * on the app's maximum aspect ratio (so it can be stretched to fill larger screens).</li>
     * <li>{@link android.R.attr#focusable} defaults to a new state ({@code auto}) where it will
     * inherit the value of {@link android.R.attr#clickable} unless explicitly overridden.</li>
     * <li>A default theme-appropriate focus-state highlight will be supplied to all Views
     * which don't provide a focus-state drawable themselves. This can be disabled by setting
     * {@link android.R.attr#defaultFocusHighlightEnabled} to false.</li>
     * </ul>
     */
    public static O = 26;

    /**
     * O MR1.
     *
     * <p>Applications targeting this or a later release will get these
     * new changes in behavior:</p>
     * <ul>
     * <li>Apps exporting and linking to apk shared libraries must explicitly
     * enumerate all signing certificates in a consistent order.</li>
     * <li>{@link android.R.attr#screenOrientation} can not be used to request a fixed
     * orientation if the associated activity is not fullscreen and opaque.</li>
     * </ul>
     */
    public static O_MR1 = 27;

    /**
     * P.
     *
     * <p>Applications targeting this or a later release will get these
     * new changes in behavior:</p>
     * <ul>
     * <li>{@link android.app.Service#startForeground Service.startForeground} requires
     * that apps hold the permission
     * {@link android.Manifest.permission#FOREGROUND_SERVICE}.</li>
     * <li>{@link android.widget.LinearLayout} will always remeasure weighted children,
     * even if there is no excess space.</li>
     * </ul>
     */
    public static P = 28;


    /**
     * Q.
     * <p>
     * <em>Why? Why, to give you a taste of your future, a preview of things
     * to come. Con permiso, Capitan. The hall is rented, the orchestra
     * engaged. It's now time to see if you can dance.</em>
     */
    public static Q = 29;

    /**
     * R.
     */
    public static R = 30;
}