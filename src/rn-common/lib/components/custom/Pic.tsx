import React, { Component } from 'react';
import { Image, ImageResizeMode, Platform, View, ViewProps } from 'react-native';
import Svg, { Image as SvgImg } from 'react-native-svg';
import { styles } from '../../../components/styles';
import { colors } from '../../../components/colors';
import { Icon } from '../icon/Icon';

export interface PicProp extends ViewProps {
  isSvg?: boolean;
  cookie?: string;

  //url
  source: string | number;
  defSource?: string | number;

  /**
   * `headers` is an object representing the HTTP headers to send along with the
   * request for a remote image.
   */
  headers?: { [key: string]: string };

  /**
   * Determines how to resize the image when the frame doesn't match the raw
   * image dimensions.
   *
   * 'cover': Scale the image uniformly (maintain the image's aspect ratio)
   * so that both dimensions (width and height) of the image will be equal
   * to or larger than the corresponding dimension of the view (minus padding).
   *
   * 'contain': Scale the image uniformly (maintain the image's aspect ratio)
   * so that both dimensions (width and height) of the image will be equal to
   * or less than the corresponding dimension of the view (minus padding).
   *
   * 'stretch': Scale width and height independently, This may change the
   * aspect ratio of the src.
   *
   * 'repeat': Repeat the image to cover the frame of the view.
   * The image will keep it's size and aspect ratio. (iOS only)
   *
   * 'center': Scale the image down so that it is completely visible,
   * if bigger than the area of the view.
   * The image will not be scaled up.
   */
  resizeMode?: ImageResizeMode;

  /**
   * The mechanism that should be used to resize the image when the image's dimensions
   * differ from the image view's dimensions. Defaults to `auto`.
   *
   * - `auto`: Use heuristics to pick between `resize` and `scale`.
   *
   * - `resize`: A software operation which changes the encoded image in memory before it
   * gets decoded. This should be used instead of `scale` when the image is much larger
   * than the view.
   *
   * - `scale`: The image gets drawn downscaled or upscaled. Compared to `resize`, `scale` is
   * faster (usually hardware accelerated) and produces higher quality images. This
   * should be used if the image is smaller than the view. It should also be used if the
   * image is slightly bigger than the view.
   *
   * More details about `resize` and `scale` can be found at http://frescolib.org/docs/resizing-rotating.html.
   *
   * @platform android
   */
  resizeMethod?: 'auto' | 'resize' | 'scale';

  /**
   * disable loading image;
   */
  disableLoading?: boolean;
}

/**
 *
 */
export class PicState {
  /**
   * 0.加载, 1.成功 -1.失败
   */
  loadStatus = 0;

  //网络原图大小
  height = 0;
  width = 0;
}

/**
 * 包含图片加载状态
 */
export class Pic extends Component<PicProp, PicState> {
  //显示高宽
  w = 0;
  h = 0;

  isUrl = false;

  url = ''; //网络图片url

  constructor(props: PicProp) {
    super(props);
    let st = new PicState();
    this.state = st;
  }

  getWH() {
    if (
      typeof this.props.source === 'string' &&
      (this.props.source.startsWith('https') ||
        this.props.source.startsWith('http') ||
        Platform.OS === 'web')
    ) {
      if (!this.props.source.startsWith('data:')) this.isUrl = true;
    }

    this.w = 0;
    this.h = 0;

    if (this.props.style instanceof Array) {
      for (let prop of this.props.style as any) {
        if (prop.width != null) this.w = prop.width;

        if (prop.height != null) this.h = prop.height;
      }
    } else {
      if ((this.props as any).style?.width != null)
        this.w = (this.props as any).style?.width;
      if ((this.props as any).style?.height != null)
        this.h = (this.props as any).style?.height;
    }

    //只在网络图片url变动时加载
    if (this.isUrl && this.url !== this.props.source) {
      this.url = this.props.source as string;
      Image.getSize(
        this.props.source as string,
        (width, height) => {
          let ratio = height === 0 ? 1 : width / height;
          this.fixWH(ratio);
          if (Platform.OS === 'web') {
            this.setState({
              width: width,
              height: height,
            });
          } else {
            this.setState({
              width: width,
              height: height,
              loadStatus: 1,
            });
          }
        },
        err => {
          console.log(err);
        },
      );
    }

    if (this.w === 0 || this.h === 0) {
      //修复自动w,h
      if (this.isUrl) {
        if (this.url === this.props.source) {
          let ratio =
            this.state.height === 0 ? 1 : this.state.width / this.state.height;
          this.fixWH(ratio);
        }
      } else if (Platform.OS !== 'web') {
        this.url = '';
        const sourceToUse = Image.resolveAssetSource(
          this.props.source as number,
        );
        let ratio =
          sourceToUse.height === 0 ? 1 : sourceToUse.width / sourceToUse.height;
        this.fixWH(ratio);
      }
    }
  }

  fixWH(ratio: number) {
    if (ratio === 0) {
      ratio = 1;
    }
    if (this.w === 0 && this.h > 0) {
      this.w = this.h * ratio;
      //this.h = this.h;
    } else if (this.w > 0 && this.h === 0) {
      //this.w = this.w;
      this.h = this.w / ratio;
    }
  }

  componentDidMount() { }

  componentWillUnmount() { }

  /**
   * 加载成功
   */
  handleImageLoaded() {
    if (Platform.OS === 'web') {
      this.setState({ loadStatus: 1 });
    }
  }

  /**
   * 加载失败
   * @param {*} error
   */
  handleImageErrored() {
    // if (error.nativeEvent.error == "unknown image format") {
    //     return;
    // }

    if (this.state.loadStatus === 0) this.setState({ loadStatus: -1 });
  }

  iconW() {
    return Math.min(this.w, this.h) / 2;
  }

  /**
   * 渲染加载中界面
   */
  renderPending() {
    return (
      <View
        style={[
          this.props.style,
          styles.center,
          this.props.disableLoading ? null : { backgroundColor: colors.greyE },
        ]}>
        {this.props.disableLoading ? null : (
          <Icon name="image" size={this.iconW()} color={colors.white} />
        )}
        <Image
          {...(this.props as any)}
          fadeDuration={0}
          style={[{ width: 1, height: 1, position: 'absolute' }]}
          defaultSource={this.props.defSource}
          source={{ uri: this.props.source }}
          onLoad={() => this.handleImageLoaded()}
          onError={() => this.handleImageErrored()}
        />
      </View>
    );
  }

  /**
   * 渲染加载失败界面
   */
  renderError() {
    return (
      this.props.defSource ? <Image
        {...(this.props as any)}
        fadeDuration={0}
        source={this.props.defSource}
        style={[this.props.style, { width: this.w, height: this.h }]}
      />
        : <View
          style={[
            { backgroundColor: colors.greyLight },
            this.props.style,
            styles.center,
          ]}>
          <Icon name="error" size={this.iconW()} color={colors.red} />
        </View>
    );
  }

  render() {
    this.getWH();

    if (Platform.OS !== 'web' && this.props.isSvg) {
      return (
        <Svg style={this.props.style} width={this.w} height={this.h}>
          <SvgImg href={this.props.source as any} />
        </Svg>
      );
    }

    if (this.isUrl && Platform.OS !== 'web') {
      let { loadStatus } = this.state;
      if (loadStatus === 0) return this.renderPending();

      if (loadStatus === -1) return this.renderError();
    }

    return (
      <Image
        {...(this.props as any)}
        fadeDuration={0}
        defaultSource={this.props.defSource}
        source={this.isUrl ? { uri: this.props.source } : this.props.source}
        style={[this.props.style, { width: this.w, height: this.h }]}
      />
    );
  }
}
