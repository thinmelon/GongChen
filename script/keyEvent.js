// JavaScript Document
var Event = function(_event){
    var keycode = _event.keyCode | _event.which;
    var code = "";
    switch (keycode) {
        case 1:
        case 38: //other browsers
        case 65362: //��
		case 87:
            code = "KEY_UP";
            break;
        case 2:
        case 40: //other browsers
        case 65364: //��
		case 83:
            code = "KEY_DOWN";
            break;
        case 3:
        case 37: //other browsers
        case 65361: //��
		case 65:
            code = "KEY_LEFT";
            break;
        case 4:
        case 39: //other browsers
        case 65363: //��
		case 68:
            code = "KEY_RIGHT";
            break;
        case 13:
        case 65293: //ȷ��
            code = "KEY_SELECT";
            break;
        //case 340:
		case 640:
		case 283:
        case 8: //other browsers
        case 27: //�ȸ���������ؼ�����ҳ�����⣬��ESC���ݴ�
        case 65367: //����
            code = "KEY_BACK";
            break;
		//case 339:
		case 340:
			code = "KEY_EXIT";
			break;
        case 372:
        case 25: //��ǰ��ҳ
		case 33:
		case 306:
            code = "KEY_PAGE_UP";
            break;
        case 373:
        case 26: //���ҳ
		case 34:
		case 307:
            code = "KEY_PAGE_DOWN";
            break;
        case 513: //right [Ctrl]
        case 65360: //�˵�
		case 72:
            code = "KEY_MENU";
            break;
        case 595: //[+]
        case 63561: //������
		case 61:
            code = "KEY_VOLUME_UP";
            break;
        case 596: //[-]
        case 63562: //������
		case 45:
            code = "KEY_VOLUME_DOWN";
            break;
        case 597: //[.]
        case 63563: //����
		case 67:
            code = "KEY_VOLUME_MUTE";
            break;
        case 32:
            code = "KEY_F1";
            break;
        case 33:
            code = "KEY_F2";
            break;
        case 34:
            code = "KEY_F3";
            break;
        case 35:
            code = "KEY_F4";
            break;
        case 49:
            code = "KEY_NUMBER1";
            break;
        case 50:
            code = "KEY_NUMBER2";
            break;
        case 51:
            code = "KEY_NUMBER3";
            break;
        case 52:
            code = "KEY_NUMBER4";
            break;
        case 53:
            code = "KEY_NUMBER5";
            break;
        case 54:
            code = "KEY_NUMBER6";
            break;
        case 55:
            code = "KEY_NUMBER7";
            break;
        case 56:
            code = "KEY_NUMBER8";
            break;
        case 57:
            code = "KEY_NUMBER9";
            break;
        case 48:
            code = "KEY_NUMBER0";
            break;
        case 65307:
            code = "KEY_TRACK";
            break;
        case 36: // ϲ��
		case 76:
            code = "KEY_FAV";
            break;
        case 72: // �ؿ�
            code = "KEY_PALYBACK";
            break;
		case 320://red
		case 832:
			code = "KEY_RED";
			break;
		case 321://green
		case 833:
			code = "KEY_GREEN";
			break;
		case 322://yellow
		case 834:
			code = "KEY_YELLOW";
			break;
		case 323: //����
		case 835:
			code = "KEY_BLUE";
			break;
		case 11001:
		case 10901:
			code = "PLAY_END";
			break;
		case 5210:
		case 5209:
			code = "IPANEL_PLAY_?";
			break;
		case 5226:
			code = "IP_PLAY_5226";
			break;
		default:
			code = keycode;
			break;
		
    }
	return code;
};