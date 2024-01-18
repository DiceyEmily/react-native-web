package net.xixian.mvvm.util;

import android.annotation.SuppressLint;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.TimeZone;

/**
 * @author djm
 * on 2017/7/20 18:42.
 * describe ：日期操作工具类，主要实现了日期的常用操作。
 */

@SuppressLint("SimpleDateFormat")
public class DateUtil {

    private static SimpleDateFormat getSimpleDateFormat(String format) {
        SimpleDateFormat dff = new SimpleDateFormat(format);
        dff.setTimeZone(TimeZone.getTimeZone("GMT+08"));
        return dff;
    }

    /**
     * @param format 日期格式(年yyyy,月MM,日dd,"yyyy-MM-dd" 或者 "yyyy/MM/dd",yyyy-MM-dd HH:mm:ss,yyyy-MM-dd-HH:mm:ss)等
     * @return String 当前日期格式
     */
    public static String getFormatCurrentTime(String format) {
        return getSimpleDateFormat(format).format(new Date());
    }

    /**
     * long和format格式要对应
     *
     * @param format 毫秒
     * @param format 日期格式(年yyyy,月MM,日dd,"yyyy-MM-dd" 或者 "yyyy/MM/dd",yyyy-MM-dd HH:mm:ss)
     * @return String 指定格式的日期字符串.
     */
    public static String getDateTime(long microsecond, String format) {
        return getSimpleDateFormat(format).format(microsecond);
    }

    /**
     * 获取时间毫秒long
     *
     * @param data   时间格式的字符串
     * @param format 日期格式(年yyyy,月MM,日dd,"yyyy-MM-dd" 或者 "yyyy/MM/dd",yyyy-MM-dd HH:mm:ss)
     * @return String 指定格式的日期字符串.
     */
    public static long getLongDateTime(String data, String format) {
        try {
            return getSimpleDateFormat(format).parse(data).getTime();
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return 0;
    }

    /**
     * @param format 日期格式字符串(年yyyy, 月MM, 日dd)
     * @return string格式转换int
     */
    public static int getIntData(String format) {
        return Integer.parseInt(getFormatCurrentTime(format));
    }

    /**
     * @param date   原始日期格式
     * @param format 格式yyyy-MM-dd,yyyy-MM-dd HH:mm:ss
     * @return yyyy-MM-dd,yyyy-MM-dd HH:mm:ss格式化后的日期显示
     */
    public static String getDateFormat(String date, String format) {
        java.sql.Date mDate = java.sql.Date.valueOf(date);
        return getSimpleDateFormat(format).format(mDate);
    }

    /**
     * @param date   日期
     * @param format 格式yyyy-MM-dd,yyyy-MM-dd HH:mm:ss
     * @return String 返回给定日期字符串
     */
    public static String getFormatDate(Date date, String format) {
        return getSimpleDateFormat(format).format(date);
    }

    /**
     * 求两个日期相差天数
     *
     * @param sd 起始日期，格式yyyy-MM-dd
     * @param ed 终止日期，格式yyyy-MM-dd
     * @return 两个日期相差天数
     */
    public static long getIntervalDays(String sd, String ed) {
        return ((java.sql.Date.valueOf(ed)).getTime() - (java.sql.Date.valueOf(sd)).getTime()) / (3600 * 24 * 1000);
    }

    /**
     * 起始年月yyyy-MM与终止月yyyy-MM之间跨度的月数
     *
     * @return int
     */
    public static int getInterval(String beginMonth, String endMonth) {
        int intBeginYear = Integer.parseInt(beginMonth.substring(0, 4));
        int intBeginMonth = Integer.parseInt(beginMonth.substring(beginMonth.indexOf("-") + 1));
        int intEndYear = Integer.parseInt(endMonth.substring(0, 4));
        int intEndMonth = Integer.parseInt(endMonth.substring(endMonth.indexOf("-") + 1));
        return ((intEndYear - intBeginYear) * 12) + (intEndMonth - intBeginMonth) + 1;
    }

    /**
     * 取得指定年月日的日期对象.
     *
     * @param year  年
     * @param month 月注意是从1到12
     * @param day   日
     * @return 一个java.util.Date()类型的对象
     */
    public static Date getDateObj(int year, int month, int day) {
        Calendar c = new GregorianCalendar();
        c.set(year, month - 1, day);
        return c.getTime();
    }

    /**
     * 取得指定分隔符分割的年月日的日期对象.
     *
     * @param args  格式为"yyyy-MM-dd,yyyy/MM/dd"
     * @param split 时间格式的间隔符，例如“-”，“/”
     * @return 一个java.util.Date()类型的对象
     */
    public static Date getDateObj(String args, String split) {
        String[] temp = args.split(split);
        int year = Integer.parseInt(temp[0]);
        int month = Integer.parseInt(temp[1]);
        int day = Integer.parseInt(temp[2]);
        return getDateObj(year, month, day);
    }

    /**
     * @param data yyyy-MM
     * @return 天数，指定月份的天数
     */
    public static int getDaysOfCurMonth(final String data) {
        String[] timeArray = data.split("-");
        // 指定的年份
        int curYear = Integer.parseInt(timeArray[0]);
        // 指定的月份
        int curMonth = Integer.parseInt(timeArray[1]);
        int mArray[] = new int[]{31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
        // 判断闰年的情况 ，2月份有29天；
        if ((curYear % 400 == 0) || ((curYear % 100 != 0) && (curYear % 4 == 0))) {
            mArray[1] = 29;
        }
        return mArray[curMonth - 1];
    }

    /**
     * @param year  yyyy
     * @param month MM,参数值在[1-12]
     * @param week  [1-6],因为一个月最多有6个周
     * @param day   数字在1到7之间，包括1和7。1表示星期天，7表示星期六
     *              -6为星期日-1为星期五，0为星期六
     * @return int几号
     */
    public static int getDayofWeekInMonth(String year, String month, String week, String day) {
        // 在具有默认语言环境的默认时区内使用当前时间构造一个默认的 GregorianCalendar
        Calendar cal = new GregorianCalendar();
        int y = Integer.parseInt(year);
        int m = Integer.parseInt(month);
        cal.clear();// 不保留以前的设置
        // 将日期设置为本月的第一天。
        cal.set(y, m - 1, 1);
        cal.set(Calendar.DAY_OF_WEEK_IN_MONTH, Integer.parseInt(week));
        cal.set(Calendar.DAY_OF_WEEK, Integer.parseInt(day));
        return cal.get(Calendar.DAY_OF_MONTH);
    }

    /**
     * @param date "yyyy/MM/dd",或者"yyyy-MM-dd"
     * @return 返回指定日期是星期几的数字
     * 1表示星期天、2表示星期一、7表示星期六
     */
    public static int getDayOfWeek(String date) {
        String[] temp = null;
        if (date.indexOf("/") > 0) {
            temp = date.split("/");
        }
        if (date.indexOf("-") > 0) {
            temp = date.split("-");
        }
        assert temp != null;
        Calendar cal = new GregorianCalendar(Integer.parseInt(temp[0]), Integer.parseInt(temp[1]) - 1, Integer
                .parseInt(temp[2]));
        return cal.get(Calendar.DAY_OF_WEEK);
    }

    /**
     * @param date
     * @return 返回指定日期是星期几的数字
     * 1表示星期天、2表示星期一、7表示星期六
     */
    public static int getDayOfWeek(Date date) {
        Calendar cal = new GregorianCalendar();
        cal.setTime(date);
        return cal.get(Calendar.DAY_OF_WEEK);
    }

    /**
     * 取得给定日期加上一定天数后的日期对象.
     *
     * @param date   给定的日期对象
     * @param amount 需要添加的天数，如果是向前的天数，使用负数就可以.
     * @return Date 加上一定天数以后的Date对象.
     */
    public static Date getDateAdd(Date date, int amount) {
        Calendar cal = new GregorianCalendar();
        cal.setTime(date);
        cal.add(GregorianCalendar.DATE, amount);
        return cal.getTime();
    }

    /**
     * 根据主机的默认 TimeZone，来获得指定形式的时间字符串。
     *
     * @param dateFormat
     * @return 返回日期字符串，形式和formcat一致。
     */
    public static String getCurrentDateString(String dateFormat) {
        Calendar cal = Calendar.getInstance(TimeZone.getDefault());
        SimpleDateFormat sdf = new SimpleDateFormat(dateFormat);
        sdf.setTimeZone(TimeZone.getDefault());
        return sdf.format(cal.getTime());
    }

    /**
     * 获取两个时间串时间的差值，单位为秒
     *
     * @param startTime  开始时间 yyyy-MM-dd HH:mm:ss
     * @param endTime    结束时间 yyyy-MM-dd HH:mm:ss
     * @param dateFormat "yyyy/MM/dd HH:mm:ss".
     * @return 两个时间的差值(秒)
     */
    public static long getDiff(String startTime, String endTime, String dateFormat) {
        long diff = 0;
        SimpleDateFormat ft = getSimpleDateFormat(dateFormat);
        try {
            Date startDate = ft.parse(startTime);
            Date endDate = ft.parse(endTime);
            diff = startDate.getTime() - endDate.getTime();
            diff = diff / 1000;
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return diff;
    }

    /**
     * 获取两个时间串时间的差值，单位为毫秒
     *
     * @param startTime  开始时间 yyyy-MM-dd HH:mm:ss:SSS
     * @param endTime    结束时间 yyyy-MM-dd HH:mm:ss:SSS
     * @param dateFormat "yyyy/MM/dd HH:mm:ss".
     * @return 两个时间的差值(秒)
     */
    public static long getDiffs(String startTime, String endTime, String dateFormat) {
        long diff = 0;
        SimpleDateFormat ft = getSimpleDateFormat(dateFormat);
        try {
            Date startDate = ft.parse(startTime);
            Date endDate = ft.parse(endTime);
            diff = startDate.getTime() - endDate.getTime();
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return diff;
    }

    /**
     * 获取小时/分钟/秒
     *
     * @param second 秒
     * @return 包含小时、分钟、秒的时间字符串，例如3小时23分钟13秒。
     */
    public static String getHour(long second) {
        long hour = second / 60 / 60;
        long minute = (second - hour * 60 * 60) / 60;
        long sec = (second - hour * 60 * 60) - minute * 60;

        return hour + "小时" + minute + "分钟" + sec + "秒";

    }

    /**
     * 返回指定时间加指定小时数后的日期时间。
     * <p>
     * 格式：yyyy-MM-dd HH:mm:ss
     *
     * @param dateFormat "yyyy/MM/dd HH:mm:ss".
     * @return 时间.
     */
    public static Date getDateByAddHour(String datetime, int minute, String dateFormat) {
        Calendar cal = new GregorianCalendar();
        SimpleDateFormat ft = getSimpleDateFormat(dateFormat);
        Date date;
        try {
            date = ft.parse(datetime);
            cal.setTime(date);
            cal.add(GregorianCalendar.MINUTE, minute);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return cal.getTime();
    }

    /**
     * 计算两天之间有多少个周末（这个周末，指星期六和星期天，一个周末返回结果为2，两个为4，以此类推。）
     * （此方法目前用于统计司机用车记录。）
     *
     * @param startDate 开始日期 ，格式"yyyy/MM/dd"
     * @param endDate   结束日期 ，格式"yyyy/MM/dd"
     * @return int
     */
    public static int countWeekend(String startDate, String endDate) {
        int result = 0;
        Date mDate;
        // 开始日期
        mDate = getDateObj(startDate, "/");
        // 首先计算出都有那些日期，然后找出星期六星期天的日期
        int sumDays = Math.abs(getDiffDays(startDate, endDate));
        int dayOfWeek;
        for (int i = 0; i <= sumDays; i++) {
            // 计算每过一天的日期
            dayOfWeek = getDayOfWeek(getDateAdd(mDate, i));
            // 1 星期天 7星期六
            if (dayOfWeek == 1 || dayOfWeek == 7) {
                result++;
            }
        }
        return result;
    }

    /**
     * 返回两个日期之间相差多少天。
     *
     * @param startDate 格式"yyyy/MM/dd"
     * @param endDate   格式"yyyy/MM/dd"
     * @return 整数。
     */
    public static int getDiffDays(String startDate, String endDate) {
        long diff = 0;
        SimpleDateFormat ft = getSimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        try {
            Date sDate = ft.parse(startDate + " 00:00:00");
            Date eDate = ft.parse(endDate + " 00:00:00");
            diff = eDate.getTime() - sDate.getTime();
            // 1000*60*60*24;
            diff = diff / 86400000;
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return (int) diff;

    }

    /**
     * 根据传入的时间 和当前的时间进行比较.
     *
     * @param microsecond 毫秒
     */
    public static String getTimeConversion(long microsecond) {
        long mDurationTime = System.currentTimeMillis() - microsecond;
        if (mDurationTime < 60 * 1000) {
            return String.valueOf(Math.abs(mDurationTime / 1000)) + "秒前";
        } else if (mDurationTime < 60 * 60 * 1000) {
            return String.valueOf(mDurationTime / (60 * 1000)) + "分钟前";
        } else if (mDurationTime < 24 * 60 * 60 * 1000) {
            return String.valueOf(mDurationTime / (60 * 60 * 1000)) + "小时前";
        } else if (mDurationTime < 10 * 24 * 60 * 60 * 1000) {
            return String.valueOf(mDurationTime / (24 * 60 * 60 * 1000)) + "天前";
        } else {
            return getDateTime(microsecond, "yyyy/MM/dd HH:mm:ss");
        }
    }

    /**
     * 获取星期几
     *
     * @return 星期
     */
    public static String getWeek() {
        Calendar cal = Calendar.getInstance();
        int i = cal.get(Calendar.DAY_OF_WEEK);
        switch (i) {
            case 1:
                return "星期日";
            case 2:
                return "星期一";
            case 3:
                return "星期二";
            case 4:
                return "星期三";
            case 5:
                return "星期四";
            case 6:
                return "星期五";
            case 7:
                return "星期六";
            default:
                return "";
        }
    }

}
